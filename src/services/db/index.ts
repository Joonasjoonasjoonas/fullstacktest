import { RowDataPacket } from 'mysql2';

export type { Category } from './categories';
export type { Customer } from './customers';
export { 
  getCategories, 
  getCategoryProducts,
  getProductsByCategory 
} from './categories';
export { 
  getCustomers, 
  getCustomerDetails, 
  getCustomerOrders,
  deleteCustomer 
} from './customers'; 

export interface Product extends RowDataPacket {
  ProductID: number;
  ProductName: string;
  CategoryID: number;
  Unit: string;
  Price: number;
} 