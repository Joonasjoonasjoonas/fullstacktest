import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createCustomer } from '@/services/db/customers';

function validateInput(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  if (value.length < 2 || value.length > 100) return false;
  
  // Check for SQL injection patterns
  const sqlPatterns = ['select', 'insert', 'update', 'delete', ';', '--', '/*'];
  return !sqlPatterns.some(pattern => value.toLowerCase().includes(pattern));
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [customers] = await connection.query(`
      SELECT *
      FROM Customers
    `);
    
    console.log('All Customers:', customers);
    return NextResponse.json(customers);
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customers', error: String(error) },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    // Validate all required fields
    const fields = ['customerName', 'contactName', 'address', 'city', 'postalCode', 'country'];
    for (const field of fields) {
      if (!validateInput(body[field])) {
        console.log(`Validation failed for ${field}:`, body[field]);
        return NextResponse.json(
          { success: false, error: `Invalid ${field}` },
          { status: 400 }
        );
      }
    }
    
    const result = await createCustomer(body);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        customerId: result.customerId 
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}