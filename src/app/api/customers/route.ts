import { NextResponse } from 'next/server';
import pool from '@/lib/db';

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
    
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('Database connection established');
      
      // Insert new customer (let MySQL handle the ID auto-increment)
      const query = `INSERT INTO Customers (
        CustomerName, ContactName, 
        Address, City, PostalCode, Country
      ) VALUES (?, ?, ?, ?, ?, ?)`;
      
      const values = [
        body.customerName,
        body.contactName,
        body.address,
        body.city,
        body.postalCode,
        body.country,
      ];
      
      console.log('Executing query:', query);
      console.log('With values:', values);
      
      const [result] = await connection.execute(query, values);
      console.log('Customer added successfully:', result);
      
      return NextResponse.json({ 
        success: true, 
        customerId: result.insertId 
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } finally {
      if (connection) {
        connection.release();
        console.log('Database connection released');
      }
    }
  } catch (error) {
    console.error('Error adding customer:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { success: false, error: 'Failed to add customer' },
      { status: 500 }
    );
  }
}