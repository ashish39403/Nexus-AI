import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', password: '', confirm_password: '' });

  const { login, register, error, clearError } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.full_name, form.password, form.confirm_password);
      }
    } catch {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark
    ? 'bg-white/[0.04] border-white/10 text-slate-100 placeholder-slate-500 cyber-input'
    : 'bg-white/70 border-purple-200 text-slate-800 placeholder-slate-400 cyber-input-light';
  const cardBg = isDark ? 'glass' : 'glass-light';

  return (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden ${isDark ? 'animated-bg-dark' : 'animated-bg-light'}`}>
      {/* Grid overlay */}
      <div className={`absolute inset-0 ${isDark ? 'grid-overlay' : 'grid-overlay-light'}`} />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl orb-pulse ${isDark ? 'bg-cyan-500/8' : 'bg-purple-400/15'}`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl orb-pulse ${isDark ? 'bg-purple-600/8' : 'bg-blue-400/15'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-600/5' : 'bg-indigo-300/10'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(0,212,255,0.25)',
            }}
            animate={{ boxShadow: ['0 0 15px rgba(0,212,255,0.2)', '0 0 30px rgba(124,58,237,0.25)', '0 0 15px rgba(0,212,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <h1 className={`font-display text-2xl font-bold tracking-wider gradient-text`}>NEURAL</h1>
          <p className={`text-sm mt-1 font-medium ${textSecondary}`}>AI from the future</p>
        </div>

        {/* Card */}
        <div className={`${cardBg} rounded-2xl p-6`}>
          {/* Tab switcher */}
          <div className={`flex rounded-xl p-1 mb-6 ${isDark ? 'bg-white/[0.04]' : 'bg-black/5'}`}>
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); clearError(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 capitalize ${
                  mode === m
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg'
                      : 'bg-white text-purple-700 shadow-md'
                    : textSecondary
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="fullname"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <InputField
                    icon={<User className="w-4 h-4" />}
                    type="text"
                    name="full_name"
                    placeholder="Full name"
                    value={form.full_name}
                    onChange={handleChange}
                    className={inputBg}
                    isDark={isDark}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField
              icon={<Mail className="w-4 h-4" />}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className={inputBg}
              isDark={isDark}
            />

            <div className="relative">
              <InputField
                icon={<Lock className="w-4 h-4" />}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputBg}
                isDark={isDark}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`${textSecondary} hover:text-cyan-400 transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <InputField
                    icon={<Lock className="w-4 h-4" />}
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Confirm password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className={inputBg}
                    isDark={isDark}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3 rounded-xl font-semibold text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                boxShadow: isSubmitting ? 'none' : '0 0 24px rgba(0,212,255,0.25)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/10 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </motion.button>
          </form>
        </div>

        <p className={`text-center text-xs mt-4 ${textSecondary}`}>
          By continuing, you agree to our{' '}
          <span className="text-cyan-400 cursor-pointer hover:underline">Terms</span> and{' '}
          <span className="text-cyan-400 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
};

const InputField = ({
  icon, type, name, placeholder, value, onChange, className, isDark, rightSlot,
}: {
  icon: React.ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  isDark: boolean;
  rightSlot?: React.ReactNode;
}) => (
  <div className="relative flex items-center">
    <span className={`absolute left-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{icon}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className={`w-full pl-10 pr-${rightSlot ? '10' : '4'} py-3 rounded-xl text-sm border transition-all duration-200 ${className}`}
    />
    {rightSlot && <span className="absolute right-3.5">{rightSlot}</span>}
  </div>
);
