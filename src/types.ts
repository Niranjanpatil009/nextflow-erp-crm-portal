export type UserRole = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export type CustomerType = 'Retail' | 'Wholesale' | 'Distributor';
export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';

export interface CustomerFollowUp {
  id: string;
  customerId: string;
  note: string;
  nextFollowUpDate?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  followUps: CustomerFollowUp[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  location: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'IN' | 'OUT';

export interface StockMovementLog {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface SalesChallanItem {
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type ChallanStatus = 'Draft' | 'Confirmed' | 'Cancelled';

export interface SalesChallan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  customerBusiness: string;
  customerGst?: string;
  customerAddress?: string;
  items: SalesChallanItem[];
  totalQuantity: number;
  totalAmount: number;
  status: ChallanStatus;
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

export interface SystemStats {
  totalCustomers: number;
  activeLeads: number;
  totalProducts: number;
  lowStockCount: number;
  totalChallans: number;
  confirmedChallans: number;
  totalSalesValue: number;
  inventoryValuation: number;
}
