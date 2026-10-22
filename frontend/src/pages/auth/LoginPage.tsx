import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

export const LoginPage: React.FC<{ onLoggedIn?: () => void }> = ({ onLoggedIn }) => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('aditya@chakravyuh.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    if (onLoggedIn) onLoggedIn();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="bg-white border border-[#eaecf0] rounded-xl shadow-xl max-w-sm w-full p-8 space-y-6">
        <div>
          <span className="font-bold text-lg text-[#101828] block">Sign in to Chakravyuh</span>
          <p className="text-xs text-[#667085] mt-1">Autonomous interview scheduling & optimization engine.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">Work Email</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d0d5dd] rounded-lg p-2.5 text-xs text-[#101828]" 
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d0d5dd] rounded-lg p-2.5 text-xs text-[#101828]" 
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
