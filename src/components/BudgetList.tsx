import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';

export const BudgetList: React.FC = () => {
  const { budgets, getRemainingBudget, transactions } = useAuth();

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budgets</CardTitle>
          <CardDescription>Your budget tracking will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
            <p className="text-muted-foreground">
              Create your first budget to start tracking your spending
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSpentAmount = (monthYear: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(monthYear))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'destructive' };
    if (percentage >= 80) return { status: 'warning', color: 'secondary' };
    return { status: 'good', color: 'default' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budgets</CardTitle>
        <CardDescription>
          Track your spending against your budget limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const spentAmount = getSpentAmount(budget.monthYear);
            const remainingAmount = getRemainingBudget(budget.monthYear);
            const progressPercentage = getProgressPercentage(spentAmount, budget.limitAmount);
            const budgetStatus = getBudgetStatus(spentAmount, budget.limitAmount);
            const [year, month] = budget.monthYear.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

            return (
              <div
                key={budget.id}
                className="p-4 border border-border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{monthName}</h4>
                  </div>
                  <Badge variant={budgetStatus.color as any}>
                    {budgetStatus.status === 'exceeded' && (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Exceeded
                      </>
                    )}
                    {budgetStatus.status === 'warning' && (
                      <>
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Warning
                      </>
                    )}
                    {budgetStatus.status === 'good' && 'On Track'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className={spentAmount > budget.limitAmount ? 'text-destructive font-medium' : ''}>
                      ${spentAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Remaining: 
                      <span className={remainingAmount < 0 ? 'text-destructive ml-1' : 'text-success ml-1'}>
                        ${Math.abs(remainingAmount).toFixed(2)}
                        {remainingAmount < 0 && ' over budget'}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Budget: ${budget.limitAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};