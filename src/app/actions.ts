'use server';

import { 
  getCustomers as dbGetCustomers,
  getCustomerDetails as dbGetCustomerDetails,
  createCustomer as dbCreateCustomer,
  deleteCustomer as dbDeleteCustomer,
  type CreateCustomerData,
  type Customer
} from '@/services/db/customers';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Get all customers
export async function getCustomers() {
  console.log('Server Action: Getting all customers');
  try {
    const customers = await dbGetCustomers();
    return {
      success: true,
      data: customers
    };
  } catch (error) {
    console.error('Error getting customers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get customers'
    };
  }
}

// Get customer by ID
export async function getCustomerById(customerId: string) {
  console.log('Server Action: Getting customer:', customerId);
  try {
    const customer = await dbGetCustomerDetails(customerId);
    if (!customer) {
      return {
        success: false,
        error: 'Customer not found'
      };
    }
    return {
      success: true,
      data: customer
    };
  } catch (error) {
    console.error('Error getting customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get customer'
    };
  }
}

// Create customer
export async function createCustomer(data: CreateCustomerData) {
  console.log('Server Action: Creating customer');
  try {
    const result = await dbCreateCustomer(data);
    return result;
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer'
    };
  }
}

// Delete customer
export async function deleteCustomer(customerId: string) {
  console.log('Server Action: Deleting customer:', customerId);
  try {
    const result = await dbDeleteCustomer(customerId);
    return result;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete customer'
    };
  }
}

// Get categories
export async function getCategories() {
  console.log('Server Action: Getting categories');
  let connection;
  try {
    connection = await pool.getConnection();
    const [categories] = await connection.execute<RowDataPacket[]>(
      'SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryName'
    );
    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get categories'
    };
  } finally {
    if (connection) connection.release();
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: number) {
  console.log('Server Action: Getting products for category:', categoryId);
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.execute<RowDataPacket[]>(
      `SELECT ProductID, ProductName, Unit, Price 
       FROM Products 
       WHERE CategoryID = ? 
       ORDER BY ProductName`,
      [categoryId]
    );
    return {
      success: true,
      data: products
    };
  } catch (error) {
    console.error('Error getting products:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get products'
    };
  } finally {
    if (connection) connection.release();
  }
} 