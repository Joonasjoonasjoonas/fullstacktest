import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Customer } from '@/services/db/customers';
import { RowDataPacket } from 'mysql2';
import { deleteCustomer } from '@/services/db/customers';

// Track active deletes with timestamps
const activeDeletes = new Map<string, number>();

// Cleanup function for stale entries (older than 10 seconds)
function cleanupStaleDeletes() {
  const now = Date.now();
  for (const [id, timestamp] of activeDeletes.entries()) {
    if (now - timestamp > 10000) { // 10 seconds
      activeDeletes.delete(id);
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Got connection for GET customer:', params.id);
    
    const [customers] = await connection.execute<Customer[]>(`
      SELECT * FROM Customers WHERE CustomerID = ?
    `, [params.id]);

    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customers[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customer' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log('Released connection for GET customer:', params.id);
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'DELETE, GET, OPTIONS',
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customerId = params?.id;
  console.log('DELETE request received for customer:', customerId);
  
  if (!customerId) {
    console.log('No ID provided');
    return NextResponse.json({ 
      success: false, 
      error: 'No customer ID provided' 
    }, { status: 400 });
  }

  // Check if delete is already in progress
  if (activeDeletes.has(customerId)) {
    console.log('Delete already in progress for customer:', customerId);
    return NextResponse.json({ 
      success: false, 
      error: 'Delete already in progress' 
    }, { status: 429 });
  }

  // Create an abort controller with a 10-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds

  try {
    // Mark delete as in progress
    activeDeletes.set(customerId, Date.now());
    console.log('Starting delete for customer:', customerId);

    const result = await deleteCustomer(parseInt(customerId, 10));
    console.log('Delete result:', result);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Customer deleted successfully'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Failed to delete customer'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in DELETE route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
    // Clear the active delete immediately
    activeDeletes.delete(customerId);
    console.log('Cleared delete lock for customer:', customerId);
  }
} 