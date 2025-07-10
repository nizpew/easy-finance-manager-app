import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  LogOut,
  Building2,
  User,
  Plus
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout, getTotalIncome, getTotalExpenses, getBalance } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  if (!user) return null;

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Finance Tracker</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                {user.type === 'business' ? (
                  <Building2 className="h-4 w-4 mr-1" />
                ) : (
                  <User className="h-4 w-4 mr-1" />
                )}
                {user.name} ({user.type})
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {balance >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowTransactionForm(true)}
                className="w-full"
                size="sm"
              >
                Add Transaction
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Form */}
        {showTransactionForm && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
                <CardDescription>
                  Record your income or expense transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onClose={() => setShowTransactionForm(false)} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction List */}
        <TransactionList />
      </div>
    </div>
  );
};