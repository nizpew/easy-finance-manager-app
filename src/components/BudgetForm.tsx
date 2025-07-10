import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, X } from 'lucide-react';

interface BudgetFormProps {
  onClose?: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onClose }) => {
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [limitAmount, setLimitAmount] = useState('');
  
  const { addBudget, getBudgetForMonth } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!limitAmount || parseFloat(limitAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid budget amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    // Check if budget already exists for this month
    const existingBudget = getBudgetForMonth(monthYear);
    if (existingBudget) {
      toast({
        title: "Budget already exists",
        description: "A budget for this month already exists.",
        variant: "destructive",
      });
      return;
    }

    addBudget({
      monthYear,
      limitAmount: parseFloat(limitAmount),
    });

    toast({
      title: "Budget created!",
      description: `Budget of $${limitAmount} set for ${monthYear}.`,
    });

    if (onClose) {
      onClose();
    } else {
      setLimitAmount('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Set Monthly Budget
            </CardTitle>
            <CardDescription>
              Set a spending limit for the selected month
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthYear">Month & Year</Label>
              <Input
                id="monthYear"
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitAmount">Budget Limit ($)</Label>
              <Input
                id="limitAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Set Budget
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};