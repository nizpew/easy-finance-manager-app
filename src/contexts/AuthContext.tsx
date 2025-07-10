import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'business';
}

interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface Budget {
  id: string;
  userId: string;
  monthYear: string; // Format: YYYY-MM
  limitAmount: number;
}

interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid';
  dueDate: string;
  createdDate: string;
}

interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  invoices: Invoice[];
  goals: Goal[];
  login: (email: string, password: string, userType: 'individual' | 'business') => Promise<boolean>;
  register: (name: string, email: string, password: string, type: 'individual' | 'business') => Promise<boolean>;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  // Budget functions
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => void;
  getBudgetForMonth: (monthYear: string) => Budget | undefined;
  getRemainingBudget: (monthYear: string) => number;
  // Invoice functions (business only)
  addInvoice: (invoice: Omit<Invoice, 'id' | 'userId' | 'createdDate'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: 'pending' | 'paid') => void;
  // Goal functions (individual only)
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount'>) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  // Filter functions
  getFilteredTransactions: (filters: TransactionFilters) => Transaction[];
}

interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('financeUser');
    const savedTransactions = localStorage.getItem('financeTransactions');
    const savedBudgets = localStorage.getItem('financeBudgets');
    const savedInvoices = localStorage.getItem('financeInvoices');
    const savedGoals = localStorage.getItem('financeGoals');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const login = async (email: string, password: string, userType: 'individual' | 'business'): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API request
    const savedUsers = JSON.parse(localStorage.getItem('financeUsers') || '[]');
    const foundUser = savedUsers.find((u: User & { password: string }) => 
      u.email === email && u.password === password && u.type === userType
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('financeUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string, type: 'individual' | 'business'): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('financeUsers') || '[]');
    
    // Check if user already exists
    if (savedUsers.find((u: User) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      type,
      password
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('financeUsers', JSON.stringify(savedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('financeUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financeUser');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user.id,
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('financeTransactions', JSON.stringify(updatedTransactions));
  };

  const getUserTransactions = () => {
    return transactions.filter(t => t.userId === user?.id);
  };

  const getTotalIncome = () => {
    return getUserTransactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return getUserTransactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      userId: user.id,
    };
    
    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    localStorage.setItem('financeBudgets', JSON.stringify(updatedBudgets));
  };

  const getBudgetForMonth = (monthYear: string) => {
    return budgets.find(b => b.userId === user?.id && b.monthYear === monthYear);
  };

  const getRemainingBudget = (monthYear: string) => {
    const budget = getBudgetForMonth(monthYear);
    if (!budget) return 0;
    
    const monthExpenses = getUserTransactions()
      .filter(t => t.type === 'expense' && t.date.startsWith(monthYear))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return budget.limitAmount - monthExpenses;
  };

  // Invoice functions
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'userId' | 'createdDate'>) => {
    if (!user || user.type !== 'business') return;
    
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      userId: user.id,
      createdDate: new Date().toISOString().split('T')[0],
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('financeInvoices', JSON.stringify(updatedInvoices));
  };

  const updateInvoiceStatus = (invoiceId: string, status: 'pending' | 'paid') => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status } : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('financeInvoices', JSON.stringify(updatedInvoices));
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount'>) => {
    if (!user || user.type !== 'individual') return;
    
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      userId: user.id,
      currentAmount: 0,
    };
    
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('financeGoals', JSON.stringify(updatedGoals));
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, currentAmount: goal.currentAmount + amount } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('financeGoals', JSON.stringify(updatedGoals));
  };

  // Filter functions
  const getFilteredTransactions = (filters: TransactionFilters) => {
    let filtered = getUserTransactions();
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(t => t.date >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(t => t.date <= filters.dateTo!);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  const getUserBudgets = () => {
    return budgets.filter(b => b.userId === user?.id);
  };

  const getUserInvoices = () => {
    return invoices.filter(i => i.userId === user?.id);
  };

  const getUserGoals = () => {
    return goals.filter(g => g.userId === user?.id);
  };

  const value: AuthContextType = {
    user,
    transactions: getUserTransactions(),
    budgets: getUserBudgets(),
    invoices: getUserInvoices(),
    goals: getUserGoals(),
    login,
    register,
    logout,
    addTransaction,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    addBudget,
    getBudgetForMonth,
    getRemainingBudget,
    addInvoice,
    updateInvoiceStatus,
    addGoal,
    updateGoalProgress,
    getFilteredTransactions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};