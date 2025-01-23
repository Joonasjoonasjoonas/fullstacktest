import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1 + 1 AS solution');
    connection.release();
    
    return NextResponse.json({ 
      message: 'Database connection successful',
      data: result 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      message: 'Database connection failed',
      error: String(error) 
    }, { status: 500 });
  }
} 