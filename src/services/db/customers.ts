import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export interface Customer extends RowDataPacket {
  CustomerID: string;
  CustomerName: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
}

export async function getCustomers() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [customers] = await connection.execute<Customer[]>(`
      SELECT CustomerID, CustomerName, Address, City, PostalCode, Country
      FROM Customers
      ORDER BY CustomerName
    `);
    return customers;
  } finally {
    if (connection) connection.release();
  }
}

export async function getCustomerDetails(customerId: string) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [customers] = await connection.execute<Customer[]>(`
      SELECT * FROM Customers WHERE CustomerID = ?
    `, [customerId]);
    return customers[0];
  } finally {
    if (connection) connection.release();
  }
} 