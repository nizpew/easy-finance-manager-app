import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { Dashboard } from '@/components/Dashboard';
import { Wallet, TrendingUp, Shield, Users } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Section */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Wallet className="h-4 w-4" />
                <span>Smart Finance Tracking</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                Take Control of Your Finances
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Track expenses, manage income, and grow your wealth with our intuitive finance management platform. 
                Perfect for individuals and businesses alike.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Tracking</h3>
                  <p className="text-sm text-muted-foreground">Automated categorization</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">Bank-level security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi-User</h3>
                  <p className="text-sm text-muted-foreground">Individual & Business</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="flex-1 max-w-md w-full">
            {showRegister ? (
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
