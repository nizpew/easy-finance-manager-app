import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface TransactionFilterProps {
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({ 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'];
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

  const handleFilterChange = (key: keyof TransactionFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    
    if (value && value !== '') {
      if (key === 'type' && (value === 'income' || value === 'expense')) {
        newFilters[key] = value;
      } else if (key !== 'type') {
        (newFilters as any)[key] = value;
      }
    } else {
      delete newFilters[key];
    }
    
    // Clear category when type changes
    if (key === 'type' && filters.category) {
      delete newFilters.category;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    setFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const availableCategories = filters.type === 'income' ? incomeCategories : 
                             filters.type === 'expense' ? expenseCategories : 
                             [...incomeCategories, ...expenseCategories];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter Transactions
            </CardTitle>
            <CardDescription>
              Filter and search your transactions
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Search - Always Visible */}
        <div className="space-y-2">
          <Label htmlFor="search">Quick Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search transactions..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transaction Type */}
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select 
                  value={filters.type || ''} 
                  onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value as 'income' | 'expense')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-success" />
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center">
                        <TrendingDown className="mr-2 h-4 w-4 text-destructive" />
                        Expense
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={filters.category || ''} 
                  onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  className="w-full md:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Active filters: {Object.keys(filters).length}
              {filters.type && ` • Type: ${filters.type}`}
              {filters.category && ` • Category: ${filters.category}`}
              {filters.search && ` • Search: "${filters.search}"`}
              {(filters.dateFrom || filters.dateTo) && ` • Date range`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};