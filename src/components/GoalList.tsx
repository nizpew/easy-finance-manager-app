import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Target, Calendar, Plus, DollarSign } from 'lucide-react';

export const GoalList: React.FC = () => {
  const { goals, updateGoalProgress, user } = useAuth();
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  if (user?.type !== 'individual') {
    return null;
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Your savings goals will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No goals set</h3>
            <p className="text-muted-foreground">
              Create your first savings goal to start tracking your progress
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAddProgress = (goalId: string) => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    updateGoalProgress(goalId, parseFloat(addAmount));
    
    toast({
      title: "Progress updated!",
      description: `Added $${addAmount} to your goal.`,
    });

    setAddAmount('');
    setSelectedGoal(null);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isGoalComplete = (current: number, target: number) => {
    return current >= target;
  };

  const getDaysRemaining = (targetDate?: string) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
        <CardDescription>
          Track your progress towards your financial goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const isComplete = isGoalComplete(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);

            return (
              <div
                key={goal.id}
                className="p-4 border border-border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${
                      isComplete 
                        ? 'bg-success/10 text-success' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{goal.name}</h4>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {!isComplete && (
                    <Dialog open={selectedGoal === goal.id} onOpenChange={(open) => {
                      if (!open) {
                        setSelectedGoal(null);
                        setAddAmount('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedGoal(goal.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Progress to {goal.name}</DialogTitle>
                          <DialogDescription>
                            How much would you like to add to this goal?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={addAmount}
                              onChange={(e) => setAddAmount(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleAddProgress(goal.id)}
                              className="flex-1"
                            >
                              Add Progress
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSelectedGoal(null);
                                setAddAmount('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={isComplete ? 'text-success font-medium' : ''}>
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <Progress 
                    value={progressPercentage} 
                    className="h-3"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {isComplete ? (
                        <span className="text-success font-medium">🎉 Goal Complete!</span>
                      ) : (
                        `$${remainingAmount.toFixed(2)} remaining`
                      )}
                    </span>
                    
                    {goal.targetDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {daysRemaining !== null && daysRemaining > 0 
                            ? `${daysRemaining} days left`
                            : daysRemaining === 0
                            ? 'Due today'
                            : 'Overdue'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {progressPercentage.toFixed(1)}% complete
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