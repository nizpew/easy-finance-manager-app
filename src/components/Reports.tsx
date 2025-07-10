import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Reports: React.FC = () => {
  const { transactions } = useAuth();

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Your financial reports will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No data yet</h3>
            <p className="text-muted-foreground">
              Add some transactions to see your financial reports
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Income vs Expenses by Month
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { 
          month: 'short', 
          year: 'numeric' 
        });
      }),
      datasets: [
        {
          label: 'Income',
          data: sortedMonths.map(month => monthlyData[month].income),
          backgroundColor: 'hsl(var(--success))',
          borderColor: 'hsl(var(--success))',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: sortedMonths.map(month => monthlyData[month].expenses),
          backgroundColor: 'hsl(var(--destructive))',
          borderColor: 'hsl(var(--destructive))',
          borderWidth: 1,
        },
      ],
    };
  };

  // Spending by Category
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    const categories = Object.keys(categoryTotals);
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'hsl(var(--muted))',
      'hsl(var(--success))',
      'hsl(var(--warning))',
      'hsl(var(--destructive))',
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: categories.map(cat => categoryTotals[cat]),
          backgroundColor: categories.map((_, index) => colors[index % colors.length]),
          borderColor: categories.map((_, index) => colors[index % colors.length]),
          borderWidth: 1,
        },
      ],
    };
  };

  // Balance History
  const getBalanceHistory = () => {
    const dailyData: { [key: string]: number } = {};
    let runningBalance = 0;
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedTransactions.forEach(transaction => {
      const dateKey = transaction.date;
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
      }
      dailyData[dateKey] = runningBalance;
    });

    const dates = Object.keys(dailyData).sort();
    
    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Balance',
          data: dates.map(date => dailyData[date]),
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--primary) / 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          }
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: $${context.raw.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Income vs Expenses
          </CardTitle>
          <CardDescription>Monthly comparison of income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={getMonthlyData()} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Spending by Category
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie data={getCategoryData()} options={pieOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Balance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Balance Over Time
            </CardTitle>
            <CardDescription>Your account balance history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={getBalanceHistory()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};