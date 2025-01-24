import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import type { Customer } from '@/services/db';

export interface Customer extends RowDataPacket {
  CustomerID: number;
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

export async function deleteCustomer(customerId: number): Promise<{ success: boolean, error?: string }> {
  let connection;
  console.log('Starting delete operation for customer:', customerId);
  
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('Got connection');
    
    // Begin transaction
    await connection.beginTransaction();
    console.log('Started transaction');

    // Do everything in a single query to minimize roundtrips
    const [result] = await connection.execute(`
      DO $$
      DECLARE orderCount INT;
      BEGIN
        -- Check for orders
        SELECT COUNT(*) INTO orderCount FROM Orders WHERE CustomerID = ?;
        
        IF orderCount > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Customer has existing orders';
        ELSE
          DELETE FROM Customers WHERE CustomerID = ?;
        END IF;
      END $$;
    `, [customerId, customerId]);

    // If we got here, commit the transaction
    await connection.commit();
    console.log('Transaction committed');
    
    return { 
      success: true,
      message: 'Customer deleted successfully'
    };

  } catch (error) {
    // Rollback on error
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Delete error:', error);
    
    // Check for specific error messages
    if (error.message?.includes('Customer has existing orders')) {
      return {
        success: false,
        error: 'Cannot delete customer: Has existing orders. Please delete orders first.'
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log('Connection released');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
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