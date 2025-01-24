import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Customer } from '@/services/db/customers';
import { RowDataPacket } from 'mysql2';
import { deleteCustomer } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connection = await pool.getConnection();
  try {
    const [customers] = await connection.execute<Customer[]>(`
      SELECT * FROM Customers WHERE CustomerID = ?
    `, [params.id]);

    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customers[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customer' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteCustomer(params.id);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Unknown error occurred'
      }, { 
        status: 500 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error)
    }, { 
      status: 500 
    });
  }
} 