import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, Calendar, Tag, FileText } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions } = useAuth();

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your transaction history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground">
              Add your first transaction to start tracking your finances
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your latest financial activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{transaction.category}</h4>
                    <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    
                    {transaction.description && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span className="truncate max-w-xs">{transaction.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};