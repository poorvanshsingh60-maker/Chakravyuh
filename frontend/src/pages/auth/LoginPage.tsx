import React, { useState, useEffect, useCallback } from 'react';
import { UserRole } from '../../types/user';
import { ChakravyuhLogo } from '../../components/ChakravyuhLogo';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; full_name: string; role: UserRole }, startInDemo?: boolean) => void;
  onEnterDemo?: () => void;
  initialMode?: 'SIGNUP' | 'LOGIN';
  inviteCode?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onEnterDemo,
  initialMode = 'LOGIN'
}) => {
  const [mode, setMode] = useState<'SIGNUP' | 'LOGIN'>(initialMode);
  const clientId = authService.getGoogleClientId();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('COORDINATOR');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Google Identity Services credential listener
  useEffect(() => {
    if (!clientId) return;

    const checkGoogleGSI = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response.credential) {
                setLoading(true);
                setErrorMessage(null);
                try {
                  const res = await authService.loginWithGoogle({
                    credential: response.credential,
                    role,
                  });
                  onLogin(res.user, false);
                } catch (err: any) {
                  setErrorMessage(err.message || 'Google account verification failed on server');
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
          });
        } catch {
          // GSI init exception silently handled
        }
      }
    };

    checkGoogleGSI();
    const timer = setTimeout(checkGoogleGSI, 1000);
    return () => clearTimeout(timer);
  }, [clientId, role, onLogin]);

  // Real Google OAuth Flow
  const triggerGoogleOAuth = useCallback(() => {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      setErrorMessage('Google Identity Services script is still loading. Please check your internet connection or retry in a moment.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setErrorMessage(`Google sign-in error: ${tokenResponse.error_description || tokenResponse.error}`);
            setLoading(false);
            return;
          }
          if (tokenResponse.access_token) {
            try {
              const res = await authService.loginWithGoogle({
                accessToken: tokenResponse.access_token,
                role,
              });
              onLogin(res.user, false);
            } catch (err: any) {
              setErrorMessage(err.message || 'Failed to authenticate Google account on server');
            } finally {
              setLoading(false);
            }
          }
        },
        error_callback: (err: any) => {
          setLoading(false);
          setErrorMessage(err.message || 'Google authentication popup was closed or cancelled.');
        }
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Failed to initialize Google OAuth prompt.');
    }
  }, [clientId, role, onLogin]);

  // Standard Email/Password Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'SIGNUP') {
        const res = await authService.signup(email, password, fullName, role);
        onLogin(res.user, false);
      } else {
        const res = await authService.login(email, password);
        onLogin(res.user, false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f0f4f9] flex items-center justify-center p-4 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      
      {/* Apple HIG Clean Authentication Card */}
      <div className="bg-white border border-[#dadce0] rounded-[24px] max-w-[420px] w-full p-6 sm:p-7 shadow-xs flex flex-col justify-between max-h-[96vh] overflow-y-auto">
        
        {/* Header with Logo */}
        <div>
          <div className="flex items-center justify-between">
            <ChakravyuhLogo size={32} showText={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f2f4f7] text-[#475467] border border-[#eaecf0]">
              Enterprise v2.0
            </span>
          </div>

          <div className="mt-3.5">
            <h1 className="text-xl font-bold text-[#101828] tracking-tight">
              {mode === 'SIGNUP' ? 'Create your account' : 'Welcome to Chakravyuh'}
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              AI Scheduling & Real-Time Interview Coordination Platform
            </p>
          </div>

          {/* Real Google Sign-In Action */}
          <div className="mt-4">
            <button
              type="button"
              disabled={loading}
              onClick={triggerGoogleOAuth}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full border border-[#dadce0] hover:bg-[#f8fafd] hover:border-[#b4b7ba] text-xs font-semibold text-[#3c4043] transition-all shadow-2xs cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1668e8]" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-3.5 flex items-center justify-center">
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
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
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
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
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
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
          
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
                className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-2 text-xs text-[#101828] outline-none transition-all" 
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
              placeholder="e.g. name@company.com"
              className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-2 text-xs text-[#101828] outline-none transition-all" 
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
              placeholder="Enter password"
              className="w-full border border-[#d0d5dd] hover:border-[#98a2b3] focus:border-[#1668e8] focus:ring-2 focus:ring-[#1668e8]/15 rounded-xl px-3 py-2 text-xs text-[#101828] outline-none transition-all" 
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
                    className={`py-1.5 px-2 rounded-full border text-center text-[10px] font-semibold transition-all cursor-pointer ${
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
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1668e8] hover:bg-[#145ac7] disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-full transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{mode === 'SIGNUP' ? 'Create Account' : 'Sign In'}</span>
            </button>
          </div>

          {/* Demo Sandbox Entry Button */}
          <div className="pt-1">
            <div className="relative my-2.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eaecf0]"></div>
              </div>
              <span className="relative bg-white px-2.5 text-[10px] uppercase font-bold text-[#98a2b3]">
                or try without account
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onEnterDemo) {
                  onEnterDemo();
                } else {
                  onLogin({
                    id: 'coord-demo-1',
                    email: 'emma.watson@chakravyuh.ai',
                    full_name: 'Emma Watson (Lead Scheduler)',
                    role: 'COORDINATOR'
                  }, true);
                }
              }}
              className="w-full py-2.5 px-4 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Explore Demo Sandbox (Mock Drive)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
