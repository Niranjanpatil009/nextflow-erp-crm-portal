import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { store, USERS } from './src/server/store.js';
import { UserRole } from './src/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexflow_secret_key_2026';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For ease of demonstration/testing if header missing, default to Admin or return 401
    const testRoleHeader = req.headers['x-test-role'] as string;
    if (testRoleHeader) {
      const match = USERS.find(u => u.role.toLowerCase() === testRoleHeader.toLowerCase());
      if (match) {
        req.user = { id: match.id, name: match.name, email: match.email, role: match.role };
        return next();
      }
    }
    return res.status(401).json({ error: 'Unauthorized: Authentication token is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token invalid or expired' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password credentials' });
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatarUrl: user.avatarUrl,
  };

  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    message: 'Login successful',
    token,
    user: userPayload,
  });
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

// --- DASHBOARD STATS ---
app.get('/api/stats', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const stats = store.getStats();
  return res.json(stats);
});

// --- CUSTOMER CRM ROUTES ---
app.get('/api/customers', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;

  const customers = store.getCustomers(search, status, type);
  return res.json(customers);
});

app.get('/api/customers/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const customer = store.getCustomerById(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  return res.json(customer);
});

app.post('/api/customers', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, mobile, email, businessName, gstNumber, customerType, address, status, notes, followUpDate } = req.body;

  if (!name || !mobile || !businessName || !customerType || !address) {
    return res.status(400).json({ error: 'Required fields missing: name, mobile, businessName, customerType, address' });
  }

  const newCust = store.addCustomer({
    name,
    mobile,
    email: email || '',
    businessName,
    gstNumber: gstNumber || '',
    customerType,
    address,
    status: status || 'Lead',
    notes: notes || '',
    followUpDate: followUpDate || '',
  });

  return res.status(201).json(newCust);
});

app.put('/api/customers/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const updated = store.updateCustomer(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  return res.json(updated);
});

app.post('/api/customers/:id/follow-ups', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { note, nextFollowUpDate } = req.body;
  if (!note) {
    return res.status(400).json({ error: 'Follow-up note content is required' });
  }

  const followUp = store.addFollowUp(req.params.id, note, nextFollowUpDate, req.user);
  if (!followUp) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  return res.status(201).json(followUp);
});

// --- PRODUCT & INVENTORY ROUTES ---
app.get('/api/products', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.search as string;
  const category = req.query.category as string;
  const lowStockOnly = req.query.lowStock === 'true';

  const products = store.getProducts(search, category, lowStockOnly);
  return res.json(products);
});

app.get('/api/products/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const product = store.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, sku, category, unitPrice, currentStock, minStockAlert, location, imageUrl } = req.body;

  if (!name || !sku || !category || unitPrice === undefined || currentStock === undefined) {
    return res.status(400).json({ error: 'Required fields missing: name, sku, category, unitPrice, currentStock' });
  }

  const newProd = store.addProduct(
    {
      name,
      sku: sku.toUpperCase(),
      category,
      unitPrice: Number(unitPrice),
      currentStock: Number(currentStock),
      minStockAlert: Number(minStockAlert || 10),
      location: location || 'Warehouse A',
      imageUrl: imageUrl || '',
    },
    req.user?.name
  );

  return res.status(201).json(newProd);
});

app.put('/api/products/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { reason, ...data } = req.body;
  const updated = store.updateProduct(req.params.id, data, req.user?.name, reason);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(updated);
});

// --- STOCK MOVEMENT LOGS ---
app.get('/api/stock-logs', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const productId = req.query.productId as string;
  const logs = store.getStockLogs(productId);
  return res.json(logs);
});

// --- SALES CHALLAN ROUTES ---
app.get('/api/challans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.search as string;
  const status = req.query.status as string;
  const customerId = req.query.customerId as string;

  const challans = store.getChallans(search, status, customerId);
  return res.json(challans);
});

app.get('/api/challans/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const challan = store.getChallanById(req.params.id);
  if (!challan) {
    return res.status(404).json({ error: 'Sales Challan not found' });
  }
  return res.json(challan);
});

app.post('/api/challans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerId, items, status, notes } = req.body;
    if (!customerId || !items) {
      return res.status(400).json({ error: 'customerId and items are required' });
    }

    const challan = store.createChallan(
      {
        customerId,
        items,
        status: status === 'Confirmed' ? 'Confirmed' : 'Draft',
        notes,
      },
      req.user || { id: 'sys', name: 'Sales Agent' }
    );

    return res.status(201).json(challan);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create sales challan' });
  }
});

app.post('/api/challans/:id/confirm', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const confirmed = store.confirmChallan(req.params.id, req.user || { id: 'sys', name: 'User' });
    return res.json(confirmed);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to confirm sales challan' });
  }
});

app.post('/api/challans/:id/cancel', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const cancelled = store.cancelChallan(req.params.id, req.user || { id: 'sys', name: 'User' });
    return res.json(cancelled);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to cancel sales challan' });
  }
});

// --- POSTMAN COLLECTION & SYSTEM DOCUMENTATION API ---
app.get('/api/docs/postman', (req: Request, res: Response) => {
  const postmanCollection = {
    info: {
      name: 'NexFlow Mini ERP & CRM API Collection',
      description: 'REST API endpoints for Authentication, Customer CRM, Products, Stock Movements, and Sales Challans.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [
      {
        name: 'Auth',
        item: [
          {
            name: 'Login (Admin)',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify({ email: 'admin@nexflow.com', password: 'admin123' }, null, 2),
              },
              url: { raw: '{{baseUrl}}/api/auth/login' },
            },
          },
          {
            name: 'Current User Profile',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: '{{baseUrl}}/api/auth/me' },
            },
          },
        ],
      },
      {
        name: 'Customer CRM',
        item: [
          {
            name: 'Get Customers',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: '{{baseUrl}}/api/customers?status=Active' },
            },
          },
          {
            name: 'Create Customer',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    name: 'Karan Mehra',
                    mobile: '+91 98980 11223',
                    email: 'karan@mehraind.com',
                    businessName: 'Mehra Industrial Corp',
                    gstNumber: '27AAAAA0000A1Z5',
                    customerType: 'Distributor',
                    address: '55 Industrial Estate, Pune, MH',
                    status: 'Active',
                    notes: 'Wholesale power tool partner.',
                  },
                  null,
                  2
                ),
              },
              url: { raw: '{{baseUrl}}/api/customers' },
            },
          },
        ],
      },
      {
        name: 'Inventory',
        item: [
          {
            name: 'Get Products',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: '{{baseUrl}}/api/products?lowStock=false' },
            },
          },
          {
            name: 'Get Stock Logs',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: '{{baseUrl}}/api/stock-logs' },
            },
          },
        ],
      },
      {
        name: 'Sales Challans',
        item: [
          {
            name: 'Create Sales Challan (Draft)',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    customerId: 'cust-101',
                    items: [
                      { productId: 'prod-201', quantity: 2 },
                      { productId: 'prod-202', quantity: 3 },
                    ],
                    status: 'Draft',
                    notes: 'Delivery requested before noon.',
                  },
                  null,
                  2
                ),
              },
              url: { raw: '{{baseUrl}}/api/challans' },
            },
          },
          {
            name: 'Confirm Sales Challan',
            request: {
              method: 'POST',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: '{{baseUrl}}/api/challans/ch-2/confirm' },
            },
          },
        ],
      },
    ],
  };

  return res.json(postmanCollection);
});

// START SERVER FUNCTION
async function startServer() {
  // Vite Middleware in Dev Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexFlow Mini ERP+CRM server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
