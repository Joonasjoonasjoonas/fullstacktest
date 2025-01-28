import pool from '@/lib/db';
import type { Product } from './index';
import { RowDataPacket } from 'mysql2/promise';

interface ProductCustomer extends RowDataPacket {
  CustomerID: string;
  CustomerName: string;
  ContactName: string;
  City: string;
  Country: string;
  ProductName: string;
}

export async function getProducts() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.execute<Product[]>(`
      SELECT * FROM Products
      ORDER BY ProductName
    `);
    return products;
  } finally {
    if (connection) connection.release();
  }
}

export async function getProductCustomers(productId: string): Promise<ProductCustomer[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute<ProductCustomer[]>(`
      SELECT DISTINCT
        Customers.CustomerID,
        Customers.CustomerName,
        Customers.ContactName,
        Customers.City,
        Customers.Country,
        Products.ProductName
      FROM Customers
      JOIN Orders ON Customers.CustomerID = Orders.CustomerID
      JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
      JOIN Products ON OrderDetails.ProductID = Products.ProductID
      WHERE Products.ProductID = ?
      ORDER BY Customers.CustomerName
    `, [productId]);
    return results;
  } finally {
    if (connection) connection.release();
  }
}

export async function getProductsByCategory() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute<RowDataPacket[]>(`
      SELECT 
        Categories.CategoryName,
        Categories.CategoryID,
        Products.ProductName
      FROM Categories
      LEFT JOIN Products ON Categories.CategoryID = Products.CategoryID
      ORDER BY Categories.CategoryName, Products.ProductName
    `);
    
    // Group products by category
    const productsByCategory = (results as any[]).reduce((acc: any, curr: any) => {
      if (!acc[curr.CategoryName]) {
        acc[curr.CategoryName] = [];
      }
      acc[curr.CategoryName].push(curr.ProductName);
      return acc;
    }, {});
    
    return productsByCategory;
  } finally {
    if (connection) connection.release();
  }
}
