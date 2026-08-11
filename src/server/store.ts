import { Customer, Product, StockMovementLog, SalesChallan, User, CustomerFollowUp, MovementType } from '../types.js';

export const USERS: (User & { password: string })[] = [
  {
    id: 'usr-1',
    name: 'Alexandra Vance',
    email: 'admin@nexflow.com',
    password: 'admin123',
    role: 'Admin',
    department: 'Executive Management',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-2',
    name: 'Rahul Sharma',
    email: 'sales@nexflow.com',
    password: 'sales123',
    role: 'Sales',
    department: 'Domestic Sales',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-3',
    name: 'Vikram Patel',
    email: 'warehouse@nexflow.com',
    password: 'warehouse123',
    role: 'Warehouse',
    department: 'Logistics & Inventory',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-4',
    name: 'Priya Iyer',
    email: 'accounts@nexflow.com',
    password: 'accounts123',
    role: 'Accounts',
    department: 'Finance & Billing',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

let customers: Customer[] = [
  {
    id: 'cust-101',
    name: 'Rajesh Agarwal',
    mobile: '+91 98200 12345',
    email: 'rajesh@apexdistributors.com',
    businessName: 'Apex Distributors Pvt Ltd',
    gstNumber: '27AAACA123411Z5',
    customerType: 'Distributor',
    address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093',
    status: 'Active',
    followUpDate: '2026-08-15',
    notes: 'Key distributor for Western region. High order volume quarterly.',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-08-01T14:20:00Z',
    followUps: [
      {
        id: 'fup-1',
        customerId: 'cust-101',
        note: 'Discussed Q3 bulk discount tier. Sent revised price sheet.',
        nextFollowUpDate: '2026-08-15',
        createdBy: 'usr-2',
        createdByName: 'Rahul Sharma',
        createdAt: '2026-08-01T14:20:00Z',
      },
    ],
  },
  {
    id: 'cust-102',
    name: 'Ananya Roy',
    mobile: '+91 98311 87654',
    email: 'ananya@metroretail.in',
    businessName: 'Metro Hardware & Retail',
    gstNumber: '19BBBPM987612Z8',
    customerType: 'Wholesale',
    address: '14/B Park Street, Near City Mall, Kolkata, West Bengal 700016',
    status: 'Lead',
    followUpDate: '2026-08-12',
    notes: 'Interested in industrial electrical tools and cables. Requested sample catalog.',
    createdAt: '2026-07-20T09:15:00Z',
    updatedAt: '2026-08-05T11:00:00Z',
    followUps: [
      {
        id: 'fup-2',
        customerId: 'cust-102',
        note: 'Initial call completed. Owner requested product catalog and credit terms.',
        nextFollowUpDate: '2026-08-12',
        createdBy: 'usr-2',
        createdByName: 'Rahul Sharma',
        createdAt: '2026-08-05T11:00:00Z',
      },
    ],
  },
  {
    id: 'cust-103',
    name: 'Suresh Kumar',
    mobile: '+91 94440 55210',
    email: 'suresh@sundaramtraders.com',
    businessName: 'Sundaram Traders',
    gstNumber: '33CCCCS543211Z1',
    customerType: 'Wholesale',
    address: '88 Mount Road, Guindy Industrial Estate, Chennai, Tamil Nadu 600032',
    status: 'Active',
    followUpDate: '2026-08-20',
    notes: 'Regular buyer of heavy safety equipment and motor components.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-07-28T16:45:00Z',
    followUps: [],
  },
  {
    id: 'cust-104',
    name: 'Vikram Mehta',
    mobile: '+91 97110 44321',
    email: 'v.mehta@delhicontrols.co.in',
    businessName: 'Delhi Control Systems',
    gstNumber: '07DDDDD887711Z9',
    customerType: 'Retail',
    address: 'G-12 Nehru Place Commercial Complex, New Delhi 110019',
    status: 'Inactive',
    followUpDate: '2026-09-01',
    notes: 'Account currently paused pending GST compliance clearance.',
    createdAt: '2025-11-05T08:00:00Z',
    updatedAt: '2026-06-10T10:30:00Z',
    followUps: [],
  },
];

let products: Product[] = [
  {
    id: 'prod-201',
    name: 'Industrial Heavy-Duty Power Drill 850W',
    sku: 'PWR-DRL-850',
    category: 'Power Tools',
    unitPrice: 4250,
    currentStock: 45,
    minStockAlert: 15,
    location: 'Warehouse A - Rack 04',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prod-202',
    name: 'Digital Multimeter Pro 1000V CAT III',
    sku: 'ELE-DMM-100',
    category: 'Testing Equipment',
    unitPrice: 1850,
    currentStock: 12,
    minStockAlert: 20, // Low stock!
    location: 'Warehouse B - Bin 12',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-02T00:00:00Z',
  },
  {
    id: 'prod-203',
    name: 'Armored Copper Cable 4-Core 10sqmm (100m Roll)',
    sku: 'CBL-CU-4C10',
    category: 'Electrical Wiring',
    unitPrice: 12400,
    currentStock: 8,
    minStockAlert: 10, // Low stock!
    location: 'Warehouse A - Bay 02',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'prod-204',
    name: 'Stainless Steel Flange Valve 2-Inch',
    sku: 'VAL-SS-02IN',
    category: 'Pipes & Fittings',
    unitPrice: 3100,
    currentStock: 68,
    minStockAlert: 15,
    location: 'Warehouse C - Shelf 08',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'prod-205',
    name: 'Pneumatic Control Solenoid Valve 24V DC',
    sku: 'PNM-SOL-24V',
    category: 'Automation & Pneumatics',
    unitPrice: 2750,
    currentStock: 30,
    minStockAlert: 10,
    location: 'Warehouse B - Bin 05',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-08T00:00:00Z',
  },
];

let stockMovementLogs: StockMovementLog[] = [
  {
    id: 'log-1',
    productId: 'prod-201',
    productSku: 'PWR-DRL-850',
    productName: 'Industrial Heavy-Duty Power Drill 850W',
    quantity: 50,
    movementType: 'IN',
    reason: 'Initial Inward Procurement Batch #IN-908',
    createdBy: 'Vikram Patel',
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'log-2',
    productId: 'prod-201',
    productSku: 'PWR-DRL-850',
    productName: 'Industrial Heavy-Duty Power Drill 850W',
    quantity: 5,
    movementType: 'OUT',
    reason: 'Dispatched for Confirmed Sales Challan SCH-2026-0001',
    createdBy: 'Vikram Patel',
    createdAt: '2026-08-02T11:30:00Z',
  },
  {
    id: 'log-3',
    productId: 'prod-202',
    productSku: 'ELE-DMM-100',
    productName: 'Digital Multimeter Pro 1000V CAT III',
    quantity: 20,
    movementType: 'IN',
    reason: 'Stock Inward from Factory Vendor',
    createdBy: 'Vikram Patel',
    createdAt: '2026-07-10T14:00:00Z',
  },
  {
    id: 'log-4',
    productId: 'prod-202',
    productSku: 'ELE-DMM-100',
    productName: 'Digital Multimeter Pro 1000V CAT III',
    quantity: 8,
    movementType: 'OUT',
    reason: 'Dispatched for Sales Challan SCH-2026-0001',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-08-02T11:30:00Z',
  },
];

let salesChallans: SalesChallan[] = [
  {
    id: 'ch-1',
    challanNumber: 'SCH-2026-0001',
    customerId: 'cust-101',
    customerName: 'Rajesh Agarwal',
    customerBusiness: 'Apex Distributors Pvt Ltd',
    customerGst: '27AAACA123411Z5',
    customerAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093',
    items: [
      {
        productId: 'prod-201',
        productName: 'Industrial Heavy-Duty Power Drill 850W',
        productSku: 'PWR-DRL-850',
        unitPrice: 4250,
        quantity: 5,
        totalPrice: 21250,
      },
      {
        productId: 'prod-202',
        productName: 'Digital Multimeter Pro 1000V CAT III',
        productSku: 'ELE-DMM-100',
        unitPrice: 1850,
        quantity: 8,
        totalPrice: 14800,
      },
    ],
    totalQuantity: 13,
    totalAmount: 36050,
    status: 'Confirmed',
    notes: 'Urgent warehouse dispatch required by Friday.',
    createdBy: 'usr-2',
    createdByName: 'Rahul Sharma',
    createdAt: '2026-08-02T10:00:00Z',
    confirmedAt: '2026-08-02T11:30:00Z',
  },
  {
    id: 'ch-2',
    challanNumber: 'SCH-2026-0002',
    customerId: 'cust-103',
    customerName: 'Suresh Kumar',
    customerBusiness: 'Sundaram Traders',
    customerGst: '33CCCCS543211Z1',
    customerAddress: '88 Mount Road, Guindy Industrial Estate, Chennai, Tamil Nadu 600032',
    items: [
      {
        productId: 'prod-203',
        productName: 'Armored Copper Cable 4-Core 10sqmm (100m Roll)',
        productSku: 'CBL-CU-4C10',
        unitPrice: 12400,
        quantity: 2,
        totalPrice: 24800,
      },
      {
        productId: 'prod-204',
        productName: 'Stainless Steel Flange Valve 2-Inch',
        productSku: 'VAL-SS-02IN',
        unitPrice: 3100,
        quantity: 10,
        totalPrice: 31000,
      },
    ],
    totalQuantity: 12,
    totalAmount: 55800,
    status: 'Draft',
    notes: 'Awaiting client approval on transport charges before final confirmation.',
    createdBy: 'usr-2',
    createdByName: 'Rahul Sharma',
    createdAt: '2026-08-09T16:20:00Z',
  },
];

let challanCounter = 3;

// Store Operations
export const store = {
  // Customers
  getCustomers: (search?: string, status?: string, type?: string) => {
    let result = [...customers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.mobile.includes(q) ||
          (c.gstNumber && c.gstNumber.toLowerCase().includes(q))
      );
    }
    if (status && status !== 'ALL') {
      result = result.filter(c => c.status === status);
    }
    if (type && type !== 'ALL') {
      result = result.filter(c => c.customerType === type);
    }
    return result;
  },

  getCustomerById: (id: string) => {
    return customers.find(c => c.id === id);
  },

  addCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'followUps'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followUps: [],
    };
    customers.unshift(newCust);
    return newCust;
  },

  updateCustomer: (id: string, data: Partial<Customer>) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    customers[index] = {
      ...customers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return customers[index];
  },

  addFollowUp: (customerId: string, note: string, nextFollowUpDate?: string, user?: { id: string; name: string }) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return null;

    const newFollowUp: CustomerFollowUp = {
      id: `fup-${Date.now()}`,
      customerId,
      note,
      nextFollowUpDate,
      createdBy: user?.id || 'sys',
      createdByName: user?.name || 'System User',
      createdAt: new Date().toISOString(),
    };

    cust.followUps.unshift(newFollowUp);
    if (nextFollowUpDate) {
      cust.followUpDate = nextFollowUpDate;
    }
    cust.updatedAt = new Date().toISOString();
    return newFollowUp;
  },

  // Products
  getProducts: (search?: string, category?: string, lowStockOnly?: boolean) => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'ALL') {
      result = result.filter(p => p.category === category);
    }
    if (lowStockOnly) {
      result = result.filter(p => p.currentStock <= p.minStockAlert);
    }
    return result;
  },

  getProductById: (id: string) => {
    return products.find(p => p.id === id);
  },

  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, userName?: string) => {
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProd);

    // Initial stock log if currentStock > 0
    if (newProd.currentStock > 0) {
      store.addStockLog({
        productId: newProd.id,
        productSku: newProd.sku,
        productName: newProd.name,
        quantity: newProd.currentStock,
        movementType: 'IN',
        reason: 'Initial Product Registration Stock',
        createdBy: userName || 'Admin',
      });
    }

    return newProd;
  },

  updateProduct: (id: string, data: Partial<Product>, userName?: string, reason?: string) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProd = products[index];

    // If currentStock is being updated manually
    if (data.currentStock !== undefined && data.currentStock !== oldProd.currentStock) {
      const diff = data.currentStock - oldProd.currentStock;
      const mType: MovementType = diff > 0 ? 'IN' : 'OUT';
      store.addStockLog({
        productId: oldProd.id,
        productSku: oldProd.sku,
        productName: oldProd.name,
        quantity: Math.abs(diff),
        movementType: mType,
        reason: reason || `Manual Inventory Adjustment (${mType})`,
        createdBy: userName || 'Admin',
      });
    }

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  // Stock Logs
  getStockLogs: (productId?: string) => {
    if (productId) {
      return stockMovementLogs.filter(l => l.productId === productId);
    }
    return [...stockMovementLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addStockLog: (data: Omit<StockMovementLog, 'id' | 'createdAt'>) => {
    const newLog: StockMovementLog = {
      ...data,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    stockMovementLogs.unshift(newLog);
    return newLog;
  },

  // Sales Challans
  getChallans: (search?: string, status?: string, customerId?: string) => {
    let result = [...salesChallans];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        ch =>
          ch.challanNumber.toLowerCase().includes(q) ||
          ch.customerName.toLowerCase().includes(q) ||
          ch.customerBusiness.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'ALL') {
      result = result.filter(ch => ch.status === status);
    }
    if (customerId) {
      result = result.filter(ch => ch.customerId === customerId);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getChallanById: (id: string) => {
    return salesChallans.find(ch => ch.id === id);
  },

  createChallan: (
    data: {
      customerId: string;
      items: { productId: string; quantity: number }[];
      status: 'Draft' | 'Confirmed';
      notes?: string;
    },
    user: { id: string; name: string }
  ) => {
    const cust = customers.find(c => c.id === data.customerId);
    if (!cust) {
      throw new Error('Customer not found');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('At least one item is required to create a sales challan');
    }

    // Validate items and snapshot product data
    const snapshotItems = [];
    let totalQty = 0;
    let totalAmt = 0;

    for (const item of data.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (item.quantity <= 0) {
        throw new Error(`Quantity for ${prod.name} must be greater than 0`);
      }

      // Check stock availability if confirming directly
      if (data.status === 'Confirmed') {
        if (prod.currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${prod.name}" (SKU: ${prod.sku}). Required: ${item.quantity}, Available in stock: ${prod.currentStock}`
          );
        }
      }

      const itemTotal = prod.unitPrice * item.quantity;
      totalQty += item.quantity;
      totalAmt += itemTotal;

      snapshotItems.push({
        productId: prod.id,
        productName: prod.name,
        productSku: prod.sku,
        unitPrice: prod.unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Generate Challan Number SCH-2026-000X
    const numPadded = String(challanCounter++).padStart(4, '0');
    const challanNumber = `SCH-2026-${numPadded}`;

    const newChallan: SalesChallan = {
      id: `ch-${Date.now()}`,
      challanNumber,
      customerId: cust.id,
      customerName: cust.name,
      customerBusiness: cust.businessName,
      customerGst: cust.gstNumber,
      customerAddress: cust.address,
      items: snapshotItems,
      totalQuantity: totalQty,
      totalAmount: totalAmt,
      status: data.status,
      notes: data.notes || '',
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      confirmedAt: data.status === 'Confirmed' ? new Date().toISOString() : undefined,
    };

    // If Confirmed upon creation -> reduce stock and create stock movement logs!
    if (data.status === 'Confirmed') {
      for (const item of snapshotItems) {
        const prodIndex = products.findIndex(p => p.id === item.productId);
        if (prodIndex !== -1) {
          products[prodIndex].currentStock -= item.quantity;
          products[prodIndex].updatedAt = new Date().toISOString();

          store.addStockLog({
            productId: item.productId,
            productSku: item.productSku,
            productName: item.productName,
            quantity: item.quantity,
            movementType: 'OUT',
            reason: `Dispatched via Confirmed Sales Challan ${challanNumber}`,
            createdBy: user.name,
          });
        }
      }
    }

    salesChallans.unshift(newChallan);
    return newChallan;
  },

  confirmChallan: (id: string, user: { id: string; name: string }) => {
    const challan = salesChallans.find(ch => ch.id === id);
    if (!challan) {
      throw new Error('Sales Challan not found');
    }

    if (challan.status === 'Confirmed') {
      throw new Error('Sales Challan is already confirmed');
    }

    if (challan.status === 'Cancelled') {
      throw new Error('Cannot confirm a cancelled Sales Challan');
    }

    // Check stock for all items
    for (const item of challan.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        throw new Error(`Product ${item.productName} no longer exists`);
      }
      if (prod.currentStock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${prod.name}" (SKU: ${prod.sku}). Required: ${item.quantity}, Current Available Stock: ${prod.currentStock}`
        );
      }
    }

    // Deduct stock and write logs
    for (const item of challan.items) {
      const prodIndex = products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        products[prodIndex].currentStock -= item.quantity;
        products[prodIndex].updatedAt = new Date().toISOString();

        store.addStockLog({
          productId: item.productId,
          productSku: item.productSku,
          productName: item.productName,
          quantity: item.quantity,
          movementType: 'OUT',
          reason: `Dispatched via Confirmed Sales Challan ${challan.challanNumber}`,
          createdBy: user.name,
        });
      }
    }

    challan.status = 'Confirmed';
    challan.confirmedAt = new Date().toISOString();
    return challan;
  },

  cancelChallan: (id: string, user: { id: string; name: string }) => {
    const challan = salesChallans.find(ch => ch.id === id);
    if (!challan) {
      throw new Error('Sales Challan not found');
    }

    if (challan.status === 'Cancelled') {
      throw new Error('Challan is already cancelled');
    }

    // If it was already confirmed, restoring stock!
    if (challan.status === 'Confirmed') {
      for (const item of challan.items) {
        const prodIndex = products.findIndex(p => p.id === item.productId);
        if (prodIndex !== -1) {
          products[prodIndex].currentStock += item.quantity;
          products[prodIndex].updatedAt = new Date().toISOString();

          store.addStockLog({
            productId: item.productId,
            productSku: item.productSku,
            productName: item.productName,
            quantity: item.quantity,
            movementType: 'IN',
            reason: `Restored stock due to Cancellation of Challan ${challan.challanNumber}`,
            createdBy: user.name,
          });
        }
      }
    }

    challan.status = 'Cancelled';
    challan.cancelledAt = new Date().toISOString();
    return challan;
  },

  // Stats
  getStats: () => {
    const totalCustomers = customers.length;
    const activeLeads = customers.filter(c => c.status === 'Lead').length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.currentStock <= p.minStockAlert).length;
    const totalChallans = salesChallans.length;
    const confirmedChallans = salesChallans.filter(ch => ch.status === 'Confirmed').length;

    const totalSalesValue = salesChallans
      .filter(ch => ch.status === 'Confirmed')
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const inventoryValuation = products.reduce((acc, curr) => acc + curr.currentStock * curr.unitPrice, 0);

    return {
      totalCustomers,
      activeLeads,
      totalProducts,
      lowStockCount,
      totalChallans,
      confirmedChallans,
      totalSalesValue,
      inventoryValuation,
    };
  },
};
