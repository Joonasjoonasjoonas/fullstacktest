import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { deleteCustomer } from '@/services/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    console.log('Fetching customer details:', params.id);
    connection = await pool.getConnection();

    const [customers] = await connection.query(
      'SELECT * FROM Customers WHERE customerid = ?',
      [params.id]
    );

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customers[0];
    console.log('Found customer:', customer);
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customer details', error: String(error) },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.release();
    }
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