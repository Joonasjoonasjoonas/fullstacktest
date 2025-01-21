import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { message: 'Customer ID is required' },
      { status: 400 }
    );
  }

  let connection;
  try {
    connection = await pool.getConnection();
    
    const [orders] = await connection.query(`
      SELECT * FROM Orders WHERE CustomerID = ?
    `, [params.id]);
    
    console.log('Orders found:', orders);
    return NextResponse.json(orders);
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: String(error) },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 