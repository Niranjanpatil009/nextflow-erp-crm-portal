import React, { useState, useEffect } from 'react';
import { User, Customer, Product, StockMovementLog, SalesChallan, SystemStats } from './types';
import { api, getStoredUser } from './lib/api';
import { USERS } from './server/store';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CustomerCrmView } from './components/CustomerCrmView';
import { CustomerFormModal } from './components/CustomerFormModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { InventoryView } from './components/InventoryView';
import { ProductFormModal } from './components/ProductFormModal';
import { StockLogsModal } from './components/StockLogsModal';
import { SalesChallanView } from './components/SalesChallanView';
import { CreateChallanModal } from './components/CreateChallanModal';
import { ChallanPrintModal } from './components/ChallanPrintModal';
import { ApiDocsView } from './components/ApiDocsView';
import { LoginModal } from './components/LoginModal';

export default function App() {
  // Current logged in user (defaults to Admin for quick demo)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = getStoredUser();
    if (stored) return stored;
    return {
      id: USERS[0].id,
      name: USERS[0].name,
      email: USERS[0].email,
      role: USERS[0].role,
      department: USERS[0].department,
      avatarUrl: USERS[0].avatarUrl,
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Application Data States
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>([]);
  const [challans, setChallans] = useState<SalesChallan[]>([]);

  // Search & Filter States
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStatus, setCrmStatus] = useState('ALL');
  const [crmType, setCrmType] = useState('ALL');

  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [challanSearch, setChallanSearch] = useState('');
  const [challanStatus, setChallanStatus] = useState('ALL');

  // Modal Control States
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isStockLogsOpen, setIsStockLogsOpen] = useState(false);

  const [isCreateChallanOpen, setIsCreateChallanOpen] = useState(false);

  const [isChallanPrintOpen, setIsChallanPrintOpen] = useState(false);
  const [printChallan, setPrintChallan] = useState<SalesChallan | null>(null);

  // Load All System Data
  const loadData = async () => {
    try {
      const [sData, cData, pData, lData, chData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getCustomers(crmSearch, crmStatus, crmType).catch(() => []),
        api.getProducts(invSearch, invCategory, lowStockOnly).catch(() => []),
        api.getStockLogs().catch(() => []),
        api.getChallans(challanSearch, challanStatus).catch(() => []),
      ]);

      if (sData) setStats(sData);
      setCustomers(cData);
      setProducts(pData);
      setStockLogs(lData);
      setChallans(chData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [
    crmSearch,
    crmStatus,
    crmType,
    invSearch,
    invCategory,
    lowStockOnly,
    challanSearch,
    challanStatus,
    currentUser,
  ]);

  // Derived Category Options for Inventory Filter
  const categories = Array.from(new Set(products.map(p => p.category)));
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockAlert);

  // CRM Handlers
  const handleSaveCustomer = async (formData: any) => {
    if (editingCustomer) {
      await api.updateCustomer(editingCustomer.id, formData);
    } else {
      await api.createCustomer(formData);
    }
    await loadData();
  };

  const handleAddFollowUp = async (customerId: string, note: string, nextFollowUpDate?: string) => {
    const updatedFollowUp = await api.addFollowUp(customerId, note, nextFollowUpDate);
    const updatedCust = await api.getCustomerById(customerId);
    setDetailCustomer(updatedCust);
    await loadData();
  };

  // Product Handlers
  const handleSaveProduct = async (formData: any) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, formData, formData.reason);
    } else {
      await api.createProduct(formData);
    }
    await loadData();
  };

  // Sales Challan Handlers
  const handleCreateChallan = async (data: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    status: 'Draft' | 'Confirmed';
    notes?: string;
  }) => {
    const newChallan = await api.createChallan(data);
    await loadData();
    if (data.status === 'Confirmed') {
      setPrintChallan(newChallan);
      setIsChallanPrintOpen(true);
    }
  };

  const handleConfirmChallan = async (id: string) => {
    await api.confirmChallan(id);
    await loadData();
  };

  const handleCancelChallan = async (id: string) => {
    await api.cancelChallan(id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-16">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onUserChange={u => {
          setCurrentUser(u);
          loadData();
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={stats?.lowStockCount || 0}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            stats={stats}
            recentChallans={challans}
            lowStockProducts={lowStockProducts}
            onNavigate={setActiveTab}
            onCreateChallan={() => setIsCreateChallanOpen(true)}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerFormOpen(true);
            }}
            onAddProduct={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
            onOpenStockLogs={() => setIsStockLogsOpen(true)}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerCrmView
            customers={customers}
            currentUser={currentUser}
            onOpenAddModal={() => {
              setEditingCustomer(null);
              setIsCustomerFormOpen(true);
            }}
            onOpenEditModal={cust => {
              setEditingCustomer(cust);
              setIsCustomerFormOpen(true);
            }}
            onOpenDetailModal={cust => {
              setDetailCustomer(cust);
              setIsCustomerDetailOpen(true);
            }}
            searchTerm={crmSearch}
            setSearchTerm={setCrmSearch}
            statusFilter={crmStatus}
            setStatusFilter={setCrmStatus}
            typeFilter={crmType}
            setTypeFilter={setCrmType}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            currentUser={currentUser}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
            onOpenEditModal={prod => {
              setEditingProduct(prod);
              setIsProductFormOpen(true);
            }}
            onOpenStockLogs={() => setIsStockLogsOpen(true)}
            searchTerm={invSearch}
            setSearchTerm={setInvSearch}
            categoryFilter={invCategory}
            setCategoryFilter={setInvCategory}
            lowStockOnly={lowStockOnly}
            setLowStockOnly={setLowStockOnly}
            categories={categories}
          />
        )}

        {activeTab === 'challans' && (
          <SalesChallanView
            challans={challans}
            currentUser={currentUser}
            onOpenCreateModal={() => setIsCreateChallanOpen(true)}
            onConfirmChallan={handleConfirmChallan}
            onCancelChallan={handleCancelChallan}
            onOpenPrintModal={ch => {
              setPrintChallan(ch);
              setIsChallanPrintOpen(true);
            }}
            searchTerm={challanSearch}
            setSearchTerm={setChallanSearch}
            statusFilter={challanStatus}
            setStatusFilter={setChallanStatus}
          />
        )}

        {activeTab === 'apidocs' && <ApiDocsView />}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={u => {
          setCurrentUser(u);
          loadData();
        }}
      />

      <CustomerFormModal
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSubmit={handleSaveCustomer}
        initialData={editingCustomer}
      />

      <CustomerDetailModal
        isOpen={isCustomerDetailOpen}
        onClose={() => setIsCustomerDetailOpen(false)}
        customer={detailCustomer}
        onAddFollowUp={handleAddFollowUp}
        currentUser={currentUser}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

      <StockLogsModal
        isOpen={isStockLogsOpen}
        onClose={() => setIsStockLogsOpen(false)}
        logs={stockLogs}
      />

      <CreateChallanModal
        isOpen={isCreateChallanOpen}
        onClose={() => setIsCreateChallanOpen(false)}
        customers={customers}
        products={products}
        onSubmit={handleCreateChallan}
        currentUser={currentUser}
      />

      <ChallanPrintModal
        isOpen={isChallanPrintOpen}
        onClose={() => setIsChallanPrintOpen(false)}
        challan={printChallan}
      />
    </div>
  );
}
