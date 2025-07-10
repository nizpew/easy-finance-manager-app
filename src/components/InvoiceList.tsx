import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Calendar, DollarSign, CheckCircle, Clock, User } from 'lucide-react';

export const InvoiceList: React.FC = () => {
  const { invoices, updateInvoiceStatus, user } = useAuth();

  if (user?.type !== 'business') {
    return null;
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Your business invoices will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground">
              Create your first invoice to start tracking payments
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleStatusChange = (invoiceId: string, currentStatus: 'pending' | 'paid') => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    updateInvoiceStatus(invoiceId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold text-warning">${totalPending.toFixed(2)}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">${totalPaid.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            Manage your business invoices and track payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedInvoices.map((invoice) => {
              const isOverdue = invoice.status === 'pending' && new Date(invoice.dueDate) < new Date();
              
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-success/10 text-success' 
                        : isOverdue
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{invoice.clientName}</h4>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          isOverdue ? 'destructive' : 'secondary'
                        }>
                          {invoice.status === 'paid' ? 'Paid' : 
                           isOverdue ? 'Overdue' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Created: {new Date(invoice.createdDate).toLocaleDateString()}</span>
                        </div>
                        
                        {invoice.description && (
                          <span className="truncate max-w-xs">{invoice.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        ${invoice.amount.toFixed(2)}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(invoice.id, invoice.status)}
                    >
                      Mark as {invoice.status === 'pending' ? 'Paid' : 'Pending'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};