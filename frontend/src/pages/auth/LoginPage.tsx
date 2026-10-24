import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types/user';
import { ChakravyuhLogo } from '../../components/ChakravyuhLogo';
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; full_name: string; role: UserRole }, startInDemo?: boolean) => void;
  initialMode?: 'SIGNUP' | 'LOGIN';
  inviteCode?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  initialMode = 'LOGIN',
  inviteCode: propInviteCode
}) => {
  const [mode, setMode] = useState<'SIGNUP' | 'LOGIN'>(initialMode);
  
  // Detect invite link in URL query params
  const [inviteParam, setInviteParam] = useState<string | null>(propInviteCode || null);

  useEffect(() => {
    if (!inviteParam) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('invite');
      if (code) {
        setInviteParam(code);
      }
    }
  }, [inviteParam]);

  // Form fields
  const [fullName, setFullName] = useState(inviteParam ? 'Marcus Vance' : '');
  const [email, setEmail] = useState(inviteParam ? 'marcus.vance@candidate.com' : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(inviteParam ? 'CANDIDATE' : 'COORDINATOR');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'SIGNUP') {
        const res = await authService.signup(
          email,
          password || 'demo123',
          fullName || email.split('@')[0],
          role
        );
        onLogin(res.user, false);
      } else {
        const res = await authService.login(email, password || 'demo123');
        onLogin(res.user, false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickRole: UserRole) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      let emailToLogin = 'admin@chakravyuh.ai';
      let pwdToLogin = 'demo123';
      if (quickRole === 'INTERVIEWER') {
        emailToLogin = 'sarah.chen@google.com';
        pwdToLogin = 'demo123';
      } else if (quickRole === 'CANDIDATE') {
        emailToLogin = 'marcus.vance@candidate.com';
        pwdToLogin = 'demo123';
      }

      const res = await authService.login(emailToLogin, pwdToLogin);
      onLogin(res.user, false);
    } catch {
      // Fallback in case backend server is unreachable
      if (quickRole === 'COORDINATOR') {
        onLogin({
          id: 'coord-1',
          email: 'admin@chakravyuh.ai',
          full_name: 'Emma Watson (Lead Scheduler)',
          role: 'COORDINATOR'
        }, false);
      } else if (quickRole === 'INTERVIEWER') {
        onLogin({
          id: 'int-1',
          email: 'sarah.chen@google.com',
          full_name: 'Dr. Sarah Chen (Google)',
          role: 'INTERVIEWER'
        }, false);
      } else {
        onLogin({
          id: 'cand-1',
          email: 'marcus.vance@candidate.com',
          full_name: 'Marcus Vance (Candidate)',
          role: 'CANDIDATE'
        }, false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f0f4f9] flex items-center justify-center p-4 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Compact Google-Style Authentication Card */}
      <div className="bg-white border border-[#dadce0] rounded-[24px] max-w-[420px] w-full p-6 sm:p-7 shadow-xs flex flex-col justify-between max-h-[96vh]">
        
        {/* Header with Logo */}
        <div>
          <div className="flex items-center justify-between">
            <ChakravyuhLogo size={32} showText={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2f4f7] text-[#475467]">
              Enterprise Demo
            </span>
          </div>

          {/* Candidate Invite Welcome Banner (If opened via invite link) */}
          {inviteParam ? (
            <div className="mt-3 p-3 rounded-xl bg-[#eff8ff] border border-[#b2ddff] text-left">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#175cd3] shrink-0" />
                <span className="text-xs font-bold text-[#175cd3]">
                  Technical Interview Loop Invite
                </span>
              </div>
              <p className="text-[11px] text-[#344054] mt-1 leading-tight">
                You have been invited for <strong>Google SDE Interview Loop</strong>. Sign in to view and select your slots.
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <h1 className="text-xl font-normal text-[#1f1f1f] tracking-tight">
                {mode === 'SIGNUP' ? 'Create an account' : 'Sign in to Chakravyuh'}
              </h1>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Enterprise Interview Loop Scheduling Platform
              </p>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f0f4f9] rounded-lg mt-3">
            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'LOGIN' 
                  ? 'bg-white text-[#1f1f1f] shadow-2xs border border-[#dadce0]' 
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('SIGNUP')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'SIGNUP' 
                  ? 'bg-white text-[#1f1f1f] shadow-2xs border border-[#dadce0]' 
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
          
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}
          
          {/* Full Name in Sign Up mode */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-medium text-[#444746] mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                required
                className="w-full border border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] rounded-md px-3 py-1.5 text-xs text-[#1f1f1f] outline-none transition-colors" 
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-medium text-[#444746] mb-1">
              Email address
            </label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marcus.vance@candidate.com"
              className="w-full border border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] rounded-md px-3 py-1.5 text-xs text-[#1f1f1f] outline-none transition-colors" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-medium text-[#444746] mb-1">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (default: demo123)"
              className="w-full border border-[#747775] hover:border-[#1f1f1f] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] rounded-md px-3 py-1.5 text-xs text-[#1f1f1f] outline-none transition-colors" 
            />
          </div>

          {/* Role selection in Sign Up mode */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-medium text-[#444746] mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['COORDINATOR', 'INTERVIEWER', 'CANDIDATE'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-2 rounded-md border text-center text-[10px] font-semibold transition-all ${
                      role === r
                        ? 'border-[#0b57d0] bg-[#f0f4f9] text-[#0b57d0]'
                        : 'border-[#dadce0] hover:border-[#747775] text-[#444746]'
                    }`}
                  >
                    {r === 'COORDINATOR' ? 'Coordinator' : r === 'INTERVIEWER' ? 'Interviewer' : 'Candidate'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1.5">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-none flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{mode === 'SIGNUP' ? 'Create Account' : 'Sign In'}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Role Exploration (Role-Specific Demos) */}
        <div className="mt-3 pt-3 border-t border-[#eaecf0]">
          <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-2 text-center">
            Or Test Directly via Role Demo
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('COORDINATOR')}
              className="p-1.5 rounded-lg border border-[#eaecf0] hover:border-[#0b57d0] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Coordinator
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Main Scheduler
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('INTERVIEWER')}
              className="p-1.5 rounded-lg border border-[#eaecf0] hover:border-[#0b57d0] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Interviewer
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Dr. Sarah (Google)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('CANDIDATE')}
              className="p-1.5 rounded-lg border border-[#eaecf0] hover:border-[#0b57d0] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Candidate
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Marcus (Candidate)
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
