import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import landingDress from "@/assets/landing-dress.jpg";

const COMMON_PASSWORDS = ['password','123456','12345678','qwerty','abc123','monkey','1234567','letmein','trustno1','dragon','baseball','iloveyou','master','sunshine','ashley','bailey','passw0rd','shadow','123123'];

const passwordSchema = z.string()
  .min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)
  .refine((p) => !COMMON_PASSWORDS.includes(p.toLowerCase()));

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<string[]>([]);
  const [pwdTouched, setPwdTouched] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = (pwd: string) => {
    if (!pwd) return setPwdErrors([]);
    const errs: string[] = [];
    if (pwd.length < 8) errs.push("8+ characters");
    if (!/[A-Z]/.test(pwd)) errs.push("One uppercase");
    if (!/[a-z]/.test(pwd)) errs.push("One lowercase");
    if (!/[0-9]/.test(pwd)) errs.push("One number");
    if (!/[^A-Za-z0-9]/.test(pwd)) errs.push("One symbol");
    if (COMMON_PASSWORDS.includes(pwd.toLowerCase())) errs.push("Too common");
    setPwdErrors(errs);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) navigate('/home'); });
  }, [navigate]);

  const cleanup = () => {
    Object.keys(localStorage).forEach((k) => { if (k.startsWith('supabase.auth.') || k.includes('sb-')) localStorage.removeItem(k); });
    Object.keys(sessionStorage || {}).forEach((k) => { if (k.startsWith('supabase.auth.') || k.includes('sb-')) sessionStorage.removeItem(k); });
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      cleanup();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
      const redirectUrl = `${window.location.origin}/home`;
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
        if (error) throw error;
        toast({ title: "Check your email", description: "We've sent you a confirmation link." });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) window.location.href = '/home';
      }
    } catch (e: any) {
      toast({ title: "Authentication error", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      cleanup();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (e: any) {
      toast({ title: "Authentication error", description: e.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Editorial visual side */}
      <div className="hidden lg:block relative overflow-hidden bg-secondary">
        <img src={landingDress} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors">
          ← OneTribe
        </button>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="text-eyebrow text-white/70 mb-4">Vol. 03 — Welcome</p>
          <h2
            className="font-semibold tracking-[-0.03em] leading-[1]"
            style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
          >
            Home,<br />
            <span className="italic font-light">delivered.</span>
          </h2>
          <p className="mt-6 text-white/70 max-w-sm leading-relaxed text-[15px]">
            Join the global Habesha marketplace. Discover authentic goods, curated by the community.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center p-8 sm:p-16 relative">
        <button onClick={() => navigate('/')} className="lg:hidden absolute top-6 left-6 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground">
          ← Back
        </button>

        <div className="max-w-sm w-full mx-auto">
          <p className="text-eyebrow text-muted-foreground mb-3">{mode === 'signup' ? "New account" : "Welcome back"}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.03em] leading-[1.05] mb-2">
            {mode === 'signup' ? <>Begin your <span className="italic font-light text-muted-foreground">story.</span></> : <>Sign in to <span className="italic font-light text-muted-foreground">continue.</span></>}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            {mode === 'signup' ? "Already have an account?" : "New here?"}{' '}
            <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setPwdErrors([]); setPwdTouched(false); }} className="text-foreground underline underline-offset-4 hover:no-underline">
              {mode === 'signup' ? "Sign in" : "Create an account"}
            </button>
          </p>

          <div className="space-y-5">
            <label className="block">
              <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full bg-transparent border-b border-border focus:border-foreground transition-colors py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (mode === 'signup' && pwdTouched) validate(e.target.value); }}
                onBlur={() => { if (mode === 'signup') { setPwdTouched(true); validate(password); } }}
                placeholder="••••••••"
                className="mt-1.5 w-full bg-transparent border-b border-border focus:border-foreground transition-colors py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              {mode === 'signup' && password && pwdTouched && (
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                  {["8+ characters","One uppercase","One lowercase","One number","One symbol"].map((req) => {
                    const failed = pwdErrors.includes(req);
                    return (
                      <span key={req} className={`text-[11px] tracking-tight ${failed ? "text-muted-foreground" : "text-foreground"}`}>
                        {failed ? "○" : "●"} {req}
                      </span>
                    );
                  })}
                </div>
              )}
            </label>

            <button
              onClick={handleAuth}
              disabled={loading || !email || !password || (mode === 'signup' && pwdErrors.length > 0)}
              className="w-full h-12 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all duration-200 ease-spring disabled:opacity-50 mt-4"
            >
              {loading ? "…" : (mode === 'signup' ? "Create account" : "Sign in")}
            </button>

            <div className="flex items-center gap-4 my-2">
              <span className="flex-1 h-px bg-border" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Or</span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-12 border border-border text-sm font-medium rounded-full hover:border-foreground transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="mt-10 text-[11px] text-muted-foreground leading-relaxed text-center">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
