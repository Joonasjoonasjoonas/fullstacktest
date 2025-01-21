import { NextResponse } from 'next/server';
import pool from '@/lib/db';

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