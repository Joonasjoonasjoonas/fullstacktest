import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import type { Customer } from '@/services/db';

export interface Customer extends RowDataPacket {
  CustomerID: string;
  CustomerName: string;
  ContactName: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
}

export interface CreateCustomerData {
  customerName: string;
  contactName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export async function getCustomers() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [customers] = await connection.execute<Customer[]>(`
      SELECT CustomerID, CustomerName, ContactName, Address, City, PostalCode, Country
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
      SELECT CustomerID, CustomerName, ContactName, Address, City, PostalCode, Country 
      FROM Customers 
      WHERE CustomerID = ?
    `, [customerId]);
    return customers[0];
  } finally {
    if (connection) connection.release();
  }
}

export async function getNextCustomerId() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [lastCustomer] = await connection.execute(
      'SELECT CustomerID FROM Customers ORDER BY CustomerID DESC LIMIT 1'
    );
    const lastId = lastCustomer[0]?.CustomerID || 'C0000';
    return 'C' + String(Number(lastId.slice(1)) + 1).padStart(4, '0');
  } finally {
    if (connection) connection.release();
  }
}

export async function getCustomerOrders(customerId: string) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [orders] = await connection.execute(`
      SELECT 
        Orders.OrderID,
        Orders.CustomerID,
        Orders.EmployeeID,
        Orders.OrderDate,
        Orders.ShipperID,
        OrderDetails.ProductID,
        OrderDetails.Quantity,
        Products.ProductName,
        Products.Unit,
        Products.Price
      FROM Orders
      LEFT JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
      LEFT JOIN Products ON OrderDetails.ProductID = Products.ProductID
      WHERE Orders.CustomerID = ?
      ORDER BY Orders.OrderDate DESC
    `, [customerId]);
    return orders;
  } finally {
    if (connection) connection.release();
  }
}

export async function deleteCustomer(customerId: string): Promise<{ success: boolean, error?: string }> {
  const connection = await pool.getConnection();
  
  try {
    // Simple direct delete - just like we did manually
    const [result] = await connection.execute(
      'DELETE FROM Customers WHERE CustomerID = ?',
      [customerId]
    );

    // Check if any row was actually deleted
    const success = (result as any).affectedRows > 0;
    return { 
      success,
      error: success ? undefined : 'Customer not found'
    };
    
  } catch (error) {
    console.error('Delete error:', error);
    return { 
      success: false, 
      error: `Delete failed: ${String(error)}` 
    };
  } finally {
    connection.release();
  }
}

export async function createCustomer(data: CreateCustomerData) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO Customers (
        CustomerName, ContactName, 
        Address, City, PostalCode, Country
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.customerName,
        data.contactName,
        data.address,
        data.city,
        data.postalCode,
        data.country,
      ]
    );

    return { 
      success: true, 
      customerId: (result as any).insertId 
    };
  } catch (error) {
    console.error('Create customer error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create customer'
    };
  } finally {
    if (connection) connection.release();
  }
} 