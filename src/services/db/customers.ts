import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

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
    const [lastCustomer] = await connection.execute<Customer[]>(
      'SELECT CustomerID FROM Customers ORDER BY CustomerID DESC LIMIT 1'
    );
    const lastId = lastCustomer[0]?.CustomerID || 'C0000';
    return 'C' + String(Number(lastId.slice(1)) + 1).padStart(4, '0');
  } finally {
    if (connection) connection.release();
  }
}

interface CustomerOrder extends RowDataPacket {
  OrderID: number;
  CustomerID: string;
  EmployeeID: number;
  OrderDate: Date;
  ShipperID: number;
  ProductID: number;
  Quantity: number;
  ProductName: string;
  Unit: string;
  Price: number;
}

export async function getCustomerOrders(customerId: string): Promise<CustomerOrder[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [orders] = await connection.execute<CustomerOrder[]>(`
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

export async function deleteCustomer(customerId: string): Promise<{ 
  success: boolean;
  error?: string;
  message?: string;
}> {
  let connection;
  console.log('Starting delete operation for customer:', customerId);
  
  try {
    connection = await pool.getConnection();
    console.log('Got connection');
    
    await connection.beginTransaction();
    console.log('Started transaction');

    // First check if customer has orders
    const [orderCheck] = await connection.execute<RowDataPacket[]>(
      'SELECT EXISTS(SELECT 1 FROM Orders WHERE CustomerID = ?) as hasOrders',
      [customerId]
    );

    if (orderCheck[0].hasOrders) {
      await connection.rollback();
      return {
        success: false,
        error: 'Cannot delete customer: Has existing orders. Please delete orders first.'
      };
    }

    // If no orders exist, proceed with delete
    const [deleteResult] = await connection.execute(
      'DELETE FROM Customers WHERE CustomerID = ?',
      [customerId]
    );

    await connection.commit();
    console.log('Transaction committed');
    
    // Check if any rows were affected
    const rowsAffected = (deleteResult as any).affectedRows;
    if (rowsAffected === 0) {
      return {
        success: false,
        error: 'Customer not found'
      };
    }
    
    return { 
      success: true,
      message: 'Customer deleted successfully'
    };

  } catch (error: unknown) {
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Delete error:', error);
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