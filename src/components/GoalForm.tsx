import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Target, X } from 'lucide-react';

interface GoalFormProps {
  onClose?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  
  const { addGoal, user } = useAuth();
  const { toast } = useToast();

  if (user?.type !== 'individual') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast({
        title: "Invalid target amount",
        description: "Please enter a valid target amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Goal name required",
        description: "Please enter a name for your goal.",
        variant: "destructive",
      });
      return;
    }

    addGoal({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate || undefined,
      description: description.trim() || undefined,
    });

    toast({
      title: "Goal created!",
      description: `Your goal "${name}" has been created with a target of $${targetAmount}.`,
    });

    if (onClose) {
      onClose();
    } else {
      // Reset form
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setDescription('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Create Savings Goal
            </CardTitle>
            <CardDescription>
              Set a financial goal to work towards
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
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Emergency Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="targetDate">Target Date (Optional)</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal and why it's important to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Create Goal
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