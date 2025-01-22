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