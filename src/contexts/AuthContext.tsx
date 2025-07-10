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

interface AuthContextType {
  user: User | null;
  transactions: Transaction[];
  login: (email: string, password: string, userType: 'individual' | 'business') => Promise<boolean>;
  register: (name: string, email: string, password: string, type: 'individual' | 'business') => Promise<boolean>;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
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

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('financeUser');
    const savedTransactions = localStorage.getItem('financeTransactions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
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

  const value: AuthContextType = {
    user,
    transactions: getUserTransactions(),
    login,
    register,
    logout,
    addTransaction,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};