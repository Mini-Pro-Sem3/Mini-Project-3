import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, User as UserIcon, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalRole, login, register } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(authModalRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Sync role when modal opened
  React.useEffect(() => {
    setRole(authModalRole);
    setError('');
  }, [authModalRole, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }
    setError('');
    login(email, role);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    register(name, email, phone);
  };

  const fillDemoCitizen = () => {
    setEmail('sarah.chen@civic.org');
    setPassword('civicclean2026');
    setRole('citizen');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin.marcus@sanitation.gov');
    setPassword('municipal99');
    setRole('admin');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E5DA] overflow-hidden">
        {/* Header */}
        <div className="bg-[#F6F5EC] px-6 py-4 border-b border-[#E6E5DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {role === 'admin' ? (
              <ShieldCheck className="w-5 h-5 text-[#687447]" />
            ) : (
              <UserIcon className="w-5 h-5 text-[#687447]" />
            )}
            <h3 className="text-base font-bold text-[#292D25]">
              {role === 'admin' ? 'Municipal Authority Sign In' : 'Citizen Portal Access'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-[#71717A] hover:text-[#292D25] hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-[#E6E5DA]/60">
          <div className="grid grid-cols-2 p-1 bg-[#F6F5EC] rounded-lg text-xs font-semibold">
            <button
              onClick={() => {
                setRole('citizen');
                setError('');
              }}
              className={`py-1.5 px-3 rounded-md transition-all ${
                role === 'citizen'
                  ? 'bg-white text-[#292D25] shadow-xs'
                  : 'text-[#71717A] hover:text-[#292D25]'
              }`}
            >
              Citizen Account
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setActiveTab('login'); // Admins only log in
                setError('');
              }}
              className={`py-1.5 px-3 rounded-md transition-all ${
                role === 'admin'
                  ? 'bg-white text-[#292D25] shadow-xs'
                  : 'text-[#71717A] hover:text-[#292D25]'
              }`}
            >
              Municipal Admin
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Quick Demo Pre-fill helper banner */}
          <div className="mb-4 p-2.5 bg-[#FAFAF5] rounded-lg border border-[#E6E5DA] flex items-center justify-between text-xs">
            <span className="text-[#292D25]/75">Quick fill demo login:</span>
            {role === 'citizen' ? (
              <button
                type="button"
                onClick={fillDemoCitizen}
                className="font-semibold text-[#687447] hover:underline"
              >
                Citizen (Sarah Chen)
              </button>
            ) : (
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="font-semibold text-[#687447] hover:underline"
              >
                Admin (Marcus Vance)
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  {role === 'admin' ? 'Municipal Admin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin.marcus@sanitation.gov' : 'sarah.chen@civic.org'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447] focus:ring-1 focus:ring-[#687447]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#292D25]">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link simulated: Please use demo password or any text.')}
                    className="text-[11px] text-[#687447] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447] focus:ring-1 focus:ring-[#687447]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{role === 'admin' ? 'Access Admin Console' : 'Sign In to Citizen Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {role === 'citizen' && (
                <div className="pt-2 text-center text-xs text-[#71717A]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setError('');
                    }}
                    className="font-semibold text-[#687447] hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena.r@community.org"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-4820"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#292D25] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292D25] mb-1">Confirm</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Register & Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center text-xs text-[#71717A]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className="font-semibold text-[#687447] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
