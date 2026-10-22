import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { UserRole } from '../../types/user';
import { ChakravyuhLogo } from '../../components/ChakravyuhLogo';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; full_name: string; role: UserRole }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('coordinator@chakravyuh.ai');
  const [password, setPassword] = useState('password123');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'coord-1',
      email: email || 'coordinator@chakravyuh.ai',
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center p-6 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Top Brand Header with Authentic Labyrinth Logo */}
      <div className="mb-6 flex flex-col items-center text-center space-y-3">
        <ChakravyuhLogo size={48} showText={false} />
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e7f2fe] border border-[#bcd7fd] text-[#1668e8] text-[11px] font-mono font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CHAKRAVYUH OPTIMIZATION SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Enterprise Interview Orchestration
          </h1>
          <p className="text-xs text-[#667085] max-w-sm mx-auto mt-1">
            Combinatorial constraint scheduling engine powered by Google OR-Tools CP-SAT.
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white border border-[#eaecf0] rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div>
          <span className="font-bold text-base text-[#101828] block">Sign In to Workspace</span>
          <p className="text-xs text-[#667085] mt-1">Select a role below or enter your work credentials.</p>
        </div>

        {/* 1-Click Demo Persona Logins */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#98a2b3] uppercase tracking-wider block">
            1-Click Persona Access
          </span>

          {/* Coordinator */}
          <button
            type="button"
            onClick={() => handleQuickLogin('COORDINATOR')}
            className="w-full p-3 rounded-xl border border-[#eaecf0] hover:border-[#1668e8] bg-[#f9fafb] hover:bg-[#eff8ff] flex items-center justify-between transition-all text-left text-xs group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#e7f2fe] text-[#1668e8] flex items-center justify-center font-bold text-sm shadow-xs">
                👑
              </div>
              <div>
                <span className="font-bold text-[#101828] block group-hover:text-[#1668e8]">Coordinator Portal</span>
                <span className="text-[11px] text-[#667085]">Emma Watson • Master Solver, Config & Dispatch</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1668e8] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Interviewer */}
          <button
            type="button"
            onClick={() => handleQuickLogin('INTERVIEWER')}
            className="w-full p-3 rounded-xl border border-[#eaecf0] hover:border-[#12b76a] bg-[#f9fafb] hover:bg-[#ecfdf3] flex items-center justify-between transition-all text-left text-xs group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ecfdf3] text-[#027a48] flex items-center justify-center font-bold text-sm shadow-xs">
                💼
              </div>
              <div>
                <span className="font-bold text-[#101828] block group-hover:text-[#027a48]">Interviewer Portal</span>
                <span className="text-[11px] text-[#667085]">Dr. Sarah Chen • Rubric Scorecards & Availability</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#027a48] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Candidate */}
          <button
            type="button"
            onClick={() => handleQuickLogin('CANDIDATE')}
            className="w-full p-3 rounded-xl border border-[#eaecf0] hover:border-[#6941c6] bg-[#f9fafb] hover:bg-[#f4ebff] flex items-center justify-between transition-all text-left text-xs group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f4ebff] text-[#6941c6] flex items-center justify-center font-bold text-sm shadow-xs">
                🎓
              </div>
              <div>
                <span className="font-bold text-[#101828] block group-hover:text-[#6941c6]">Candidate Portal</span>
                <span className="text-[11px] text-[#667085]">Alex Mercer • Confirmed Loop, Timezones & Slots</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6941c6] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#eaecf0] w-full"></div>
          <span className="bg-white px-3 text-[11px] text-[#98a2b3] absolute">or sign in with credentials</span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg pl-9 pr-3 py-2 text-xs text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#344054]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#98a2b3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#d0d5dd] rounded-lg pl-9 pr-3 py-2 text-xs text-[#101828] focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8] outline-none" 
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 font-bold shadow-xs">
            Sign In with Enterprise SSO
          </Button>
        </form>

      </div>

      <div className="mt-8 text-center text-xs text-[#98a2b3] font-mono">
        Chakravyuh Labyrinth Architecture • Google OR-Tools v2.4
      </div>

    </div>
  );
};
