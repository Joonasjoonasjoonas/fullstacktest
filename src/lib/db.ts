import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'northwind',
  waitForConnections: true,
  connectionLimit: 1, // Reduce to single connection for testing
  queueLimit: 0
});

// Simple test query function
export async function testQuery(sql: string, params: any[] = []) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(sql, params);
    return result;
  } finally {
    connection.release();
  }
}

export default pool; 