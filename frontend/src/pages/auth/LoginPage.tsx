import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types/user';
import { ChakravyuhLogo } from '../../components/ChakravyuhLogo';
import { AlertCircle, Loader2, Mail, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; full_name: string; role: UserRole }, startInDemo?: boolean) => void;
  initialMode?: 'SIGNUP' | 'LOGIN';
  inviteCode?: string | null;
}

interface DemoGoogleAccount {
  email: string;
  name: string;
  role: UserRole;
  avatarBg: string;
  initials: string;
  tagline: string;
}

const DEMO_GOOGLE_ACCOUNTS: DemoGoogleAccount[] = [
  {
    email: 'aditya.singh@gmail.com',
    name: 'Aditya Singh',
    role: 'COORDINATOR',
    avatarBg: 'bg-blue-600',
    initials: 'AS',
    tagline: 'Lead Recruiter & System Admin'
  },
  {
    email: 'emma.watson@chakravyuh.ai',
    name: 'Emma Watson',
    role: 'COORDINATOR',
    avatarBg: 'bg-indigo-600',
    initials: 'EW',
    tagline: 'Lead Scheduling Coordinator'
  },
  {
    email: 'sarah.chen@google.com',
    name: 'Dr. Sarah Chen',
    role: 'INTERVIEWER',
    avatarBg: 'bg-emerald-600',
    initials: 'SC',
    tagline: 'Staff Systems Interviewer (Google Panel)'
  },
  {
    email: 'marcus.vance@candidate.com',
    name: 'Marcus Vance',
    role: 'CANDIDATE',
    avatarBg: 'bg-purple-600',
    initials: 'MV',
    tagline: 'SDE Finalist (Candidate Portal)'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  initialMode = 'LOGIN',
  inviteCode: propInviteCode
}) => {
  const [mode, setMode] = useState<'SIGNUP' | 'LOGIN'>(initialMode);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  
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

  // 1-Click Guest Login
  const handleGuestLogin = () => {
    setLoading(true);
    try {
      const res = authService.loginAsGuest('COORDINATOR');
      onLogin(res.user, false);
    } finally {
      setLoading(false);
    }
  };

  // Google Login from Account Chooser
  const handleGoogleAccountSelect = (acc: DemoGoogleAccount) => {
    setGoogleModalOpen(false);
    setLoading(true);
    try {
      const res = authService.loginWithGoogle({
        email: acc.email,
        name: acc.name,
        role: acc.role
      });
      onLogin(res.user, false);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    setGoogleModalOpen(false);
    setLoading(true);
    try {
      const name = customGoogleEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      const res = authService.loginWithGoogle({
        email: customGoogleEmail.trim(),
        name: formattedName,
        role: 'COORDINATOR'
      });
      onLogin(res.user, false);
    } finally {
      setLoading(false);
    }
  };

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

  const handleQuickLogin = (quickRole: UserRole) => {
    const acc = DEMO_GOOGLE_ACCOUNTS.find(a => a.role === quickRole) || DEMO_GOOGLE_ACCOUNTS[0];
    handleGoogleAccountSelect(acc);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f0f4f9] flex items-center justify-center p-4 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Compact Apple/Google Hybrid Authentication Card */}
      <div className="bg-white border border-[#dadce0] rounded-[24px] max-w-[420px] w-full p-6 sm:p-7 shadow-xs flex flex-col justify-between max-h-[96vh] overflow-y-auto">
        
        {/* Header with Logo */}
        <div>
          <div className="flex items-center justify-between">
            <ChakravyuhLogo size={32} showText={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f2f4f7] text-[#475467] border border-[#eaecf0]">
              Enterprise v2.0
            </span>
          </div>

          {/* Candidate Invite Welcome Banner (If opened via invite link) */}
          {inviteParam ? (
            <div className="mt-3.5 p-3.5 rounded-2xl bg-[#eff8ff] border border-[#b2ddff] text-left">
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
            <div className="mt-3.5">
              <h1 className="text-xl font-bold text-[#101828] tracking-tight">
                {mode === 'SIGNUP' ? 'Create your account' : 'Welcome to Chakravyuh'}
              </h1>
              <p className="text-xs text-[#667085] mt-0.5">
                AI Scheduling & Real-Time Interview Coordination Platform
              </p>
            </div>
          )}

          {/* Fast Track Actions: Google Sign-In & Instant Guest Access */}
          <div className="mt-4 space-y-2">
            
            {/* Google Sign-In Pill Button */}
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full border border-[#dadce0] hover:bg-[#f8fafd] hover:border-[#b4b7ba] text-xs font-semibold text-[#3c4043] transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* 1-Click Guest Login Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#f0f4f9] hover:bg-[#e4e8ef] text-xs font-semibold text-[#1f1f1f] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1668e8]" />
              <span>Continue as Guest (1-Click Instant Demo)</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eaecf0]"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-[#98a2b3]">
              or use credentials
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#f0f4f9] rounded-full">
            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all ${
                mode === 'LOGIN' 
                  ? 'bg-white text-[#101828] shadow-2xs border border-[#dadce0]' 
                  : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('SIGNUP')}
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all ${
                mode === 'SIGNUP' 
                  ? 'bg-white text-[#101828] shadow-2xs border border-[#dadce0]' 
                  : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
          
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}
          
          {/* Full Name in Sign Up mode */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-medium text-[#344054] mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                required
                className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-1.5 text-xs text-[#101828] outline-none transition-all" 
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-medium text-[#344054] mb-1">
              Email address
            </label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marcus.vance@candidate.com"
              className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-1.5 text-xs text-[#101828] outline-none transition-all" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-medium text-[#344054] mb-1">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (default: demo123)"
              className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-1.5 text-xs text-[#101828] outline-none transition-all" 
            />
          </div>

          {/* Role selection in Sign Up mode */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-medium text-[#344054] mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['COORDINATOR', 'INTERVIEWER', 'CANDIDATE'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-2 rounded-full border text-center text-[10px] font-semibold transition-all ${
                      role === r
                        ? 'border-[#1668e8] bg-[#eff8ff] text-[#1668e8]'
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
              className="w-full bg-[#1668e8] hover:bg-[#145ac7] disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-full transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{mode === 'SIGNUP' ? 'Create Account' : 'Sign In'}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Role Direct Launch */}
        <div className="mt-3 pt-3 border-t border-[#eaecf0]">
          <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-2 text-center">
            Or Jump In Directly via Role Persona
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('COORDINATOR')}
              className="p-2 rounded-xl border border-[#eaecf0] hover:border-[#1668e8] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Coordinator
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Scheduler Hub
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('INTERVIEWER')}
              className="p-2 rounded-xl border border-[#eaecf0] hover:border-[#1668e8] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Interviewer
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Google Panel
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('CANDIDATE')}
              className="p-2 rounded-xl border border-[#eaecf0] hover:border-[#1668e8] hover:bg-[#f8fafd] text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-[#101828] block truncate">
                Candidate
              </span>
              <span className="text-[9px] text-[#667085] block truncate">
                Marcus Vance
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Google Account Chooser Modal */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 className="text-sm font-bold text-[#101828]">Choose an Account</h3>
              </div>
              <button 
                onClick={() => setGoogleModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] p-1 rounded-full hover:bg-[#f2f4f7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475467]">
              Select an account to sign in to Chakravyuh Enterprise:
            </p>

            <div className="space-y-1.5 divide-y divide-[#f2f4f7]">
              {DEMO_GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleGoogleAccountSelect(acc)}
                  className="w-full pt-2 pb-2 px-2.5 rounded-xl hover:bg-[#f8fafd] flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                      {acc.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#101828] group-hover:text-[#1668e8] truncate">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-[#667085] truncate">{acc.email}</p>
                      <p className="text-[10px] text-[#98a2b3] truncate">{acc.tagline}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#1668e8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Google Email input */}
            <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-[#eaecf0] space-y-2">
              <label className="block text-[11px] font-semibold text-[#344054]">
                Or enter another Google account
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 border border-[#d0d5dd] focus:border-[#1668e8] rounded-full px-3 py-1.5 text-xs text-[#101828] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1668e8] hover:bg-[#145ac7] text-white text-xs font-semibold rounded-full shadow-2xs shrink-0"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
