import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export interface Category extends RowDataPacket {
  CategoryID: number;
  CategoryName: string;
  Description: string;
}

export async function getCategories() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [categories] = await connection.execute<Category[]>(`
      SELECT CategoryID, CategoryName, Description
      FROM Categories
      ORDER BY CategoryName
    `);
    return categories;
  } finally {
    if (connection) connection.release();
  }
}

export async function getCategoryProducts(categoryId: string) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(`
      SELECT 
        Products.ProductID,
        Products.ProductName,
        Categories.CategoryName
      FROM Products
      JOIN Categories ON Products.CategoryID = Categories.CategoryID
      WHERE Categories.CategoryID = ?
      ORDER BY Products.ProductName
    `, [categoryId]);
    return results;
  } finally {
    if (connection) connection.release();
  }
} 