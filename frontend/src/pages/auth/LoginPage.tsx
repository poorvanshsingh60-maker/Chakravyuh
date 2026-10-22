import React, { useState } from 'react';
import { UserRole } from '../../types/user';
import { ChakravyuhLogo } from '../../components/ChakravyuhLogo';
import { ChevronRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; full_name: string; role: UserRole }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('emma.watson@chakravyuh.ai');
  const [password, setPassword] = useState('••••••••••••');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'coord-1',
      email: email || 'emma.watson@chakravyuh.ai',
      full_name: 'Emma Watson',
      role: 'COORDINATOR'
    });
  };

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'COORDINATOR') {
      onLogin({
        id: 'coord-1',
        email: 'emma.watson@chakravyuh.ai',
        full_name: 'Emma Watson',
        role: 'COORDINATOR'
      });
    } else if (role === 'INTERVIEWER') {
      onLogin({
        id: 'int-1',
        email: 'sarah.chen@chakravyuh.ai',
        full_name: 'Dr. Sarah Chen',
        role: 'INTERVIEWER'
      });
    } else {
      onLogin({
        id: 'cand-1',
        email: 'alex.mercer@gmail.com',
        full_name: 'Alex Mercer',
        role: 'CANDIDATE'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col justify-between items-center py-8 px-4 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      <div className="w-full flex-1 flex items-center justify-center">
        {/* Google-Style Card */}
        <div className="bg-white border border-[#dadce0] rounded-[28px] max-w-[448px] w-full p-10 shadow-xs">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-start">
            <ChakravyuhLogo size={40} showText={false} />
            <h1 className="text-2xl font-normal text-[#1f1f1f] mt-4 tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-[#444746] mt-1">
              to continue to Chakravyuh
            </p>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCustomSubmit} className="mt-8 space-y-5">
            <div>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone"
                className="w-full border border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] rounded-md px-3.5 py-3.5 text-sm text-[#1f1f1f] outline-none transition-colors placeholder-[#747775]" 
              />
              <div className="mt-2 text-left">
                <button type="button" className="text-xs font-semibold text-[#0b57d0] hover:underline">
                  Forgot email?
                </button>
              </div>
            </div>

            <div>
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] rounded-md px-3.5 py-3.5 text-sm text-[#1f1f1f] outline-none transition-colors placeholder-[#747775]" 
              />
            </div>

            <p className="text-xs text-[#444746] leading-relaxed pt-1">
              Not your computer? Use a private browsing window to sign in.
            </p>

            <div className="flex items-center justify-between pt-4">
              <button 
                type="button"
                className="text-sm font-semibold text-[#0b57d0] hover:bg-[#f4f7fc] px-4 py-2 rounded-full transition-colors"
              >
                Create account
              </button>
              <button 
                type="submit"
                className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-none"
              >
                Next
              </button>
            </div>
          </form>

          {/* Demo Accounts Selector */}
          <div className="mt-8 pt-6 border-t border-[#e0e2e0]">
            <span className="text-[11px] font-semibold text-[#747775] uppercase tracking-wider block mb-3">
              Fast Demo Sign-In
            </span>

            <div className="space-y-1.5">
              {/* Coordinator */}
              <button
                type="button"
                onClick={() => handleQuickLogin('COORDINATOR')}
                className="w-full p-2.5 rounded-lg border border-[#e0e2e0] hover:border-[#0b57d0] hover:bg-[#f8fafd] flex items-center justify-between transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#0b57d0] font-semibold flex items-center justify-center text-xs">
                    EW
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1f1f1f] block group-hover:text-[#0b57d0]">
                      Emma Watson
                    </span>
                    <span className="text-[11px] text-[#747775]">
                      Recruiting Coordinator
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#747775] group-hover:text-[#0b57d0]" />
              </button>

              {/* Interviewer */}
              <button
                type="button"
                onClick={() => handleQuickLogin('INTERVIEWER')}
                className="w-full p-2.5 rounded-lg border border-[#e0e2e0] hover:border-[#0b57d0] hover:bg-[#f8fafd] flex items-center justify-between transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold flex items-center justify-center text-xs">
                    SC
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1f1f1f] block group-hover:text-[#0b57d0]">
                      Dr. Sarah Chen
                    </span>
                    <span className="text-[11px] text-[#747775]">
                      Interviewer (Senior Staff Eng)
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#747775] group-hover:text-[#0b57d0]" />
              </button>

              {/* Candidate */}
              <button
                type="button"
                onClick={() => handleQuickLogin('CANDIDATE')}
                className="w-full p-2.5 rounded-lg border border-[#e0e2e0] hover:border-[#0b57d0] hover:bg-[#f8fafd] flex items-center justify-between transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fce8e6] text-[#c5221f] font-semibold flex items-center justify-center text-xs">
                    AM
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1f1f1f] block group-hover:text-[#0b57d0]">
                      Alex Mercer
                    </span>
                    <span className="text-[11px] text-[#747775]">
                      Candidate (Staff Distributed Systems)
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#747775] group-hover:text-[#0b57d0]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Google-Style Footer */}
      <footer className="w-full max-w-[448px] flex items-center justify-between text-xs text-[#444746] pt-4 select-none">
        <span>English (United States)</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#1f1f1f]">Help</a>
          <a href="#" className="hover:text-[#1f1f1f]">Privacy</a>
          <a href="#" className="hover:text-[#1f1f1f]">Terms</a>
        </div>
      </footer>

    </div>
  );
};
