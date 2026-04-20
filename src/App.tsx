import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  ChevronRight, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  ArrowRight, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Star,
  Menu,
  X,
  CreditCard,
  User,
  LayoutDashboard,
  LogOut,
  Bell,
  HelpCircle,
  FileText,
  ChevronLeft,
  Copy,
  AlertCircle,
  Upload
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn, formatCurrency } from './lib/utils';
import { 
  CHALLENGE_ACCOUNTS, 
  INSTANT_ACCOUNTS, 
  BROKERS, 
  BROKER_LIST,
  PAYMENT_METHODS, 
  PLATFORM_CONFIG, 
  REVIEWS,
  FAQ_ITEMS,
  LEGAL_CONTENT
} from './constants';
import { AccountTier, BrokerType, BrokerInfo, PaymentMethodType, CheckoutDetails } from './types';

// --- Form Schemas ---
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  country: z.string().min(2, 'Country is required'),
  email: z.string().email('Invalid email address'),
  broker: z.enum(['Olymp Trade', 'Quotex', 'Binomo', 'Pocket Option', 'Other']),
  customBrokerName: z.string().optional(),
});

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
      <img 
        src="https://i.ibb.co/VcyBJsFK/Gemini-Generated-Image-v36xfhv36xfhv36x.png" 
        alt="QXT FUNDED" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  </div>
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-primary text-black hover:bg-sky-400',
      secondary: 'bg-white/5 text-white hover:bg-white/10 border border-border-subtle',
      outline: 'border border-border-subtle text-slate-300 hover:text-white hover:bg-white/5 rounded-full',
      ghost: 'text-text-muted hover:text-white transition-colors',
      emerald: 'bg-brand-emerald text-white hover:bg-emerald-600',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-6 py-3 font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={cn('bg-card-bg border border-border-subtle rounded-2xl p-6', className)}>
    {children}
  </div>
);

const Notification = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 20, x: 20 }}
    className="fixed bottom-6 right-6 z-50 glass-morphism rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-sm"
  >
    <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
      <Bell className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{message}</p>
      <p className="text-xs text-slate-400">Just now</p>
    </div>
    <button onClick={onClose} className="text-slate-500 hover:text-white">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// --- Pages ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'models' | 'brokers' | 'pricing' | 'checkout' | 'dashboard' | 'success' | 'privacy' | 'faq' | 'auth'>('welcome');
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const [purchasedAccounts, setPurchasedAccounts] = useState<AccountTier[]>([]);
  const [selectedModel, setSelectedModel] = useState<'challenge' | 'instant' | null>(null);
  const [selectedTier, setSelectedTier] = useState<AccountTier | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutDetails>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [postAuthDestination, setPostAuthDestination] = useState<string | null>(null);

  // Simulated notifications have been removed as per user request
  useEffect(() => {
    // No-op
  }, []);

  const handlePasskeySignUp = () => {
    if (!authEmail || !termsAccepted) return;
    
    setIsAuthLoading(true);
    // Simulated passkey verification
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthSuccess(true);
      setTimeout(() => {
        setUser({ email: authEmail, fullName: authEmail.split('@')[0] });
        if (postAuthDestination === 'brokers' && selectedTier) {
          setCurrentPage('brokers');
          setPostAuthDestination(null);
        } else {
          setCurrentPage('models');
        }
        setIsAuthSuccess(false);
      }, 1500);
    }, 2000);
  };

  const handleSelectModel = (model: 'challenge' | 'instant') => {
    setSelectedModel(model);
    setCurrentPage('pricing');
  };

  const handleSelectBroker = (brokerName: BrokerType) => {
    setCheckoutData({ ...checkoutData, broker: brokerName });
    setCurrentPage('checkout');
    setCheckoutStep(1);
  };

  const handleBuyNow = (tier: AccountTier) => {
    setSelectedTier(tier);
    if (!user) {
      setPostAuthDestination('brokers');
      setCurrentPage('auth');
    } else {
      setCurrentPage('brokers');
    }
  };

  const handleCheckoutSubmit = (data: any) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
    setCheckoutStep(2);
  };

  const handlePaymentConfirm = () => {
    setCheckoutStep(3);
    setTimeout(() => {
      // Add the account to purchased list only after verification
      if (selectedTier) {
        setPurchasedAccounts(prev => [...prev, selectedTier]);
      }
      setCurrentPage('success');
    }, 2000);
  };

  // --- Sub-sections ---

  const Sidebar = () => (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] border-right border-border-subtle bg-brand-secondary z-50 flex flex-col p-6 gap-8 hidden md:flex border-r">
      <button onClick={() => setCurrentPage('welcome')} className="text-left">
        <Logo />
      </button>
      
      <nav className="flex flex-col gap-4">
        <button onClick={() => setCurrentPage('welcome')} className={cn("sidebar-nav-item", currentPage === 'welcome' && "active")}>
          <LayoutDashboard className="w-4 h-4" />
          Home
        </button>
        <button onClick={() => setCurrentPage('models')} className={cn("sidebar-nav-item", (currentPage === 'models' || currentPage === 'pricing' || currentPage === 'brokers') && "active")}>
          <Trophy className="w-4 h-4" />
          Programs
        </button>
        <button onClick={() => setCurrentPage('dashboard')} className={cn("sidebar-nav-item", currentPage === 'dashboard' && "active")}>
          <Zap className="w-4 h-4" />
          DASHBOARD
        </button>
        <button onClick={() => setCurrentPage('faq')} className={cn("sidebar-nav-item", currentPage === 'faq' && "active")}>
          <HelpCircle className="w-4 h-4" />
          FAQ
        </button>
        <button onClick={() => setCurrentPage('privacy')} className={cn("sidebar-nav-item", currentPage === 'privacy' && "active")}>
          <FileText className="w-4 h-4" />
          Legal
        </button>
      </nav>

      <div className="mt-auto">
        <div className="text-[11px] text-text-muted uppercase font-bold tracking-tight mb-1">Support</div>
        <div className="text-xs text-slate-300">{PLATFORM_CONFIG.supportEmail}</div>
      </div>
    </aside>
  );

  const MobileNav = () => (
    <nav className="fixed top-0 w-full z-40 border-b border-border-subtle bg-brand-secondary/80 backdrop-blur-md md:hidden">
      <div className="px-6 h-16 flex items-center justify-between">
        <button onClick={() => setCurrentPage('welcome')}>
           <Logo />
        </button>
        <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-subtle bg-brand-secondary px-6 py-6 flex flex-col gap-4"
          >
           <button onClick={() => { setCurrentPage('welcome'); setIsMenuOpen(false); }} className="text-sm font-medium text-text-muted uppercase font-bold tracking-widest">Home</button>
           <button onClick={() => { setCurrentPage('models'); setIsMenuOpen(false); }} className="text-sm font-medium text-text-muted uppercase font-bold tracking-widest">Programs</button>
           <button onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }} className="text-sm font-medium text-text-muted uppercase font-bold tracking-widest">Dashboard</button>
           <button onClick={() => { setCurrentPage('faq'); setIsMenuOpen(false); }} className="text-sm font-medium text-text-muted uppercase font-bold tracking-widest">FAQ</button>
           <button onClick={() => { setCurrentPage('privacy'); setIsMenuOpen(false); }} className="text-sm font-medium text-text-muted uppercase font-bold tracking-widest">Legal</button>
           {!user && <Button onClick={handlePasskeySignUp} className="mt-4">Trader Portal</Button>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  const Header = () => (
    <header className="px-6 py-5 md:px-10 md:py-6 border-b border-border-subtle flex justify-between items-center bg-brand-secondary h-16 md:h-auto">
      <div>
        <h1 className="text-sm md:text-lg font-bold text-white mb-0.5">{user ? `Hi, ${user.fullName.split(' ')[0]}` : 'Welcome'}</h1>
        <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-wider font-semibold">Official Platform</p>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:block text-right">
          <div className="text-xs font-bold text-white uppercase tracking-tight">92% Profit Share</div>
          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
             <span className="block w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             Live Status Active
          </div>
        </div>
        {!user && (
          <Button variant="outline" onClick={handlePasskeySignUp} className="px-3 py-1.5 md:px-4 md:py-2 h-auto text-[10px] md:text-xs whitespace-nowrap">
            Sign in
          </Button>
        )}
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="px-6 py-4 md:px-10 md:py-3 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-secondary text-[11px] text-text-muted uppercase tracking-tight font-medium">
      <div>QXT FUNDED HQ: {PLATFORM_CONFIG.officeLocation}</div>
      <div className="flex gap-6">
        <span>Trustpilot ★★★★★ 4.8</span>
        <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</button>
        <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors uppercase tracking-widest">Terms & Conditions</button>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen selection:bg-brand-primary/30 flex">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1 flex flex-col md:ml-[220px]">
        <Header />
        
        <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
          <AnimatePresence mode="wait">
          {/* --- Welcome Page --- */}
          {currentPage === 'welcome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="welcome"
              className="p-6 md:p-20 flex flex-col items-center text-center"
            >
              <div className="max-w-3xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-6 block">Elite Prop Trading</span>
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-[0.9] uppercase italic tracking-tighter">
                  Precision <br /> 
                  Performance <br /> 
                  Capital
                </h2>
                <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed text-xs md:text-sm uppercase font-semibold tracking-wide">
                  Access institutional liquidity. Trade Binary Options with professional backings.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setCurrentPage('models')} className="h-14 px-10 uppercase tracking-widest text-xs">Start Evaluation</Button>
                  {!user && <Button variant="secondary" onClick={() => setCurrentPage('auth')} className="h-14 px-10 uppercase tracking-widest text-xs">Trader Login</Button>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full max-w-4xl">
                {[
                  { label: 'Payouts', value: '$84M' },
                  { label: 'Network', value: '52K' },
                  { label: 'Share', value: '92%' },
                  { label: 'Audit', value: 'Live' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold text-white mb-1 italic">{stat.value}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- Model Selection --- */}
          {currentPage === 'models' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-10 max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter mb-2">Select Your Path</h3>
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest">CHOOSE BETWEEN STRUCTURED CHALLENGE OR INSTANT FUNDING</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-8">
                <button 
                  onClick={() => handleSelectModel('challenge')}
                  className="group relative bg-card-bg border border-border-subtle rounded-2xl p-4 md:p-10 text-left hover:border-brand-primary transition-all duration-300"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-primary/10 transition-colors">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" />
                  </div>
                  <h4 className="text-sm md:text-3xl font-bold text-white uppercase italic mb-2">Challenge</h4>
                  <ul className="text-[8px] md:text-xs text-text-muted uppercase leading-relaxed font-bold tracking-tight space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-primary" /> 7 Days Evaluation</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-primary" /> 92% Profit Share</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-primary" /> $900 Daily Limit</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-primary" /> $1200 Profit Target</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-primary" /> Multi-Step Verification</li>
                  </ul>
                  <div className="mt-4 md:mt-8 flex items-center gap-2 text-brand-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                    Select Challenge <ArrowRight className="w-3 h-3" />
                  </div>
                </button>

                <button 
                  onClick={() => handleSelectModel('instant')}
                  className="group relative bg-card-bg border border-border-subtle rounded-2xl p-4 md:p-10 text-left hover:border-brand-emerald transition-all duration-300"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-emerald/10 transition-colors">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-emerald" />
                  </div>
                  <h4 className="text-sm md:text-3xl font-bold text-white uppercase italic mb-2">Instant</h4>
                  <ul className="text-[8px] md:text-xs text-text-muted uppercase leading-relaxed font-bold tracking-tight space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-emerald" /> No Evaluation Needed</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-emerald" /> Immediate Funding</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-emerald" /> Instant Withdrawals</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-emerald" /> Unlimited Profits</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5 text-brand-emerald" /> 92% Payout Share</li>
                  </ul>
                  <div className="mt-4 md:mt-8 flex items-center gap-2 text-brand-emerald text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                    Select Instant <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* --- Broker Selection --- */}
          {currentPage === 'brokers' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 md:p-10 max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-4xl font-bold text-white uppercase italic tracking-tighter mb-2">Partner Broker</h3>
                <p className="text-text-muted text-xs uppercase font-bold tracking-widest">Select your preferred execution platform</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BROKER_LIST.map((broker) => (
                  <button 
                    key={broker.name}
                    onClick={() => handleSelectBroker(broker.name)}
                    className="group bg-card-bg border border-border-subtle rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-brand-primary hover:bg-white/[0.05] transition-all"
                  >
                    <div className="h-12 w-full flex items-center justify-center transition-all opacity-100">
                      <img src={broker.logo} alt={broker.name} className="max-h-full max-w-[90%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{broker.name}</span>
                  </button>
                ))}

                <button 
                  onClick={() => handleSelectBroker('Other')}
                  className="group bg-card-bg border border-border-subtle border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-white transition-all"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted group-hover:text-white">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter group-hover:text-white">Other Broker</span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" onClick={() => setCurrentPage('models')} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 mx-auto">
                  <ChevronLeft className="w-3 h-3" /> Change Model
                </Button>
              </div>
            </motion.div>
          )}

          {/* --- Pricing Page --- */}
          {currentPage === 'pricing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="pricing"
              className="p-4 md:p-10"
            >
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                    {selectedModel === 'instant' ? 'Instant Access' : 'Challenge Programs'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">Select Account Size</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {selectedModel === 'challenge' && CHALLENGE_ACCOUNTS.map((tier) => (
                  <Card key={tier.id} className="flex flex-col gap-4 p-5 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge-blue">Challenge</span>
                        <h2 className="text-lg md:text-xl font-bold text-white mt-3">{formatCurrency(tier.size)}</h2>
                        <p className="text-[10px] text-text-muted mt-0.5">Evaluation Required</p>
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-white tracking-tighter">{formatCurrency(tier.price)}</div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 space-y-1">
                       <div className="stat-divider py-1.5 md:py-2">
                         <span className="text-[10px] md:text-xs">Target</span>
                         <span className="text-white text-[10px] md:text-xs font-bold">{formatCurrency(tier.profitTarget)}</span>
                       </div>
                       <div className="stat-divider py-1.5 md:py-2">
                         <span className="text-[10px] md:text-xs">Daily Limit</span>
                         <span className="text-rose-500 text-[10px] md:text-xs font-bold">{formatCurrency(tier.dailyLossLimit)}</span>
                       </div>
                       <div className="stat-divider py-1.5 md:py-2 border-none">
                         <span className="text-[10px] md:text-xs">Drawdown</span>
                         <span className="text-rose-500 text-[10px] md:text-xs font-bold">{formatCurrency(tier.overallDrawdown)}</span>
                       </div>
                    </div>

                    <Button onClick={() => handleBuyNow(tier)} className="w-full h-11 md:h-12 text-xs md:text-sm">Get Funded</Button>
                  </Card>
                ))}

                {selectedModel === 'instant' && INSTANT_ACCOUNTS.map((tier) => (
                  <Card key={tier.id} className="flex flex-col gap-4 border-emerald-500/20 p-5 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge-emerald">Instant</span>
                        <h2 className="text-lg md:text-xl font-bold text-white mt-3">{formatCurrency(tier.size)}</h2>
                        <p className="text-[10px] text-text-muted mt-0.5">Direct Funding</p>
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-white tracking-tighter">{formatCurrency(tier.price)}</div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 space-y-1">
                       <div className="stat-divider py-1.5 md:py-2 text-[10px] md:text-xs">
                         <span>Target</span>
                         <span className="text-emerald-500 font-bold">None</span>
                       </div>
                       <div className="stat-divider py-1.5 md:py-2 text-[10px] md:text-xs">
                         <span>Daily Limit</span>
                         <span className="text-rose-500 font-bold">{formatCurrency(tier.dailyLossLimit)}</span>
                       </div>
                       <div className="stat-divider py-1.5 md:py-2 border-none text-[10px] md:text-xs">
                         <span>Payout</span>
                         <span className="text-white font-bold">92% Share</span>
                       </div>
                    </div>

                    <Button variant="emerald" onClick={() => handleBuyNow(tier)} className="w-full h-11 md:h-12 text-xs md:text-sm">Instant Access</Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- Checkout Page --- */}
          {currentPage === 'checkout' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-10"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 overflow-x-auto pb-4 no-scrollbar">
                  {[
                    { step: 1, label: 'Info' },
                    { step: 2, label: 'Payment' },
                    { step: 3, label: 'Finish' }
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-2 md:gap-3 shrink-0">
                      <div className={cn(
                        "w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-black",
                        checkoutStep >= s.step ? "bg-brand-primary text-black" : "bg-white/5 text-slate-500 border border-white/5"
                      )}>
                        {s.step}
                      </div>
                      <span className={cn(
                        "text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                        checkoutStep >= s.step ? "text-white" : "text-slate-500"
                      )}>{s.label}</span>
                      {s.step < 3 && <div className="w-4 h-px bg-white/5 mx-1" />}
                    </div>
                  ))}
                </div>

                {checkoutStep === 1 && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="max-w-2xl px-5 py-6 md:p-8">
                      <div className="mb-6 md:mb-8">
                        <h3 className="text-lg md:text-xl font-bold text-white uppercase italic tracking-tight">Configuration</h3>
                        <p className="text-[10px] text-text-muted mt-1 uppercase font-semibold">Credential delivery details</p>
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        handleCheckoutSubmit(data);
                      }} className="space-y-4 md:space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Broker Partner</label>
                            <select 
                              name="broker" 
                              className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer" 
                              required 
                              defaultValue="Quotex"
                              onChange={(e) => setCheckoutData({...checkoutData, broker: e.target.value as BrokerType})}
                            >
                              {BROKERS.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                            </select>
                          </div>
                          {checkoutData.broker === 'Other' && (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Custom Broker</label>
                              <input name="customBrokerName" placeholder="Broker Name" className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white" required />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Full Name</label>
                          <input name="fullName" placeholder="Legal Name" className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                            <input type="email" name="email" defaultValue={user?.email} placeholder="For delivery" className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Country</label>
                            <input name="country" placeholder="Country" className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Address</label>
                          <input name="address" placeholder="Residential" className="w-full bg-white/[0.02] border border-border-subtle rounded-lg px-4 py-3 text-sm text-white" required />
                        </div>

                        <div className="pt-4 md:pt-6">
                          <Button type="submit" className="w-full h-11 md:h-12 uppercase tracking-widest text-xs">Continue to Payment</Button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>
                )}

                {checkoutStep === 2 && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                      <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <Card className="px-5 py-6 md:p-8">
                          <div className="flex justify-between items-center mb-8 md:mb-10">
                             <h3 className="text-lg md:text-xl font-bold text-white uppercase italic tracking-tight">Payment</h3>
                             <div className="text-right">
                               <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Fee</p>
                               <p className="text-lg md:text-xl font-bold text-white leading-none">{formatCurrency(selectedTier?.price || 0)}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-8 md:mb-10">
                            {PAYMENT_METHODS.map((method) => (
                              <button
                                key={method.type}
                                onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: method.type })}
                                className={cn(
                                  "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200",
                                  checkoutData.paymentMethod === method.type 
                                    ? "bg-brand-primary/10 border-brand-primary" 
                                    : "bg-white/[0.01] border-white/5"
                                )}
                              >
                                <img 
                                  src={method.logo} 
                                  alt={method.name} 
                                  className={cn(
                                    "w-6 h-6 object-contain transition-all duration-300",
                                    checkoutData.paymentMethod === method.type ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] scale-110" : "opacity-70"
                                  )} 
                                  referrerPolicy="no-referrer" 
                                />
                                <span className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-tight", checkoutData.paymentMethod === method.type ? "text-brand-primary" : "text-text-muted")}>{method.type}</span>
                              </button>
                            ))}
                          </div>

                          {checkoutData.paymentMethod && (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-white/[0.02] p-6 md:p-8 rounded-xl border border-white/5 shadow-inner">
                                <div className="p-4 bg-white rounded-xl shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                  <QRCodeSVG 
                                    value={PAYMENT_METHODS.find(m => m.type === checkoutData.paymentMethod)?.address || ''} 
                                    size={140}
                                    level="H"
                                    includeMargin={false}
                                  />
                                </div>
                                <div className="flex-1 w-full text-center md:text-left">
                                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Scanning Address ({checkoutData.paymentMethod})</p>
                                  <div className="p-3.5 bg-black/40 rounded-lg flex items-center justify-between border border-white/5 max-w-full">
                                    <code className="text-[10px] md:text-xs font-mono text-brand-primary break-all mr-4 flex-1 text-left select-all">
                                      {PAYMENT_METHODS.find(m => m.type === checkoutData.paymentMethod)?.address}
                                    </code>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(PAYMENT_METHODS.find(m => m.type === checkoutData.paymentMethod)?.address || '');
                                      }}
                                      className="p-2.5 bg-white/5 rounded-lg shrink-0 hover:bg-brand-primary/10 transition-colors group"
                                    >
                                      <Copy className="w-4 h-4 text-white group-hover:text-brand-primary transition-colors" />
                                    </button>
                                  </div>
                                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter mt-4 flex items-center justify-center md:justify-start gap-2">
                                     <AlertCircle className="w-4 h-4" />
                                     Verified Network Check Required.
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                  <Upload className="w-3 h-3" />
                                  Proof of Payment
                                </label>
                                <input 
                                  type="file" 
                                  className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-white/5 file:text-white"
                                />
                              </div>

                              <div className="flex flex-col md:flex-row gap-3 pt-2">
                                <Button variant="secondary" onClick={() => setCheckoutStep(1)} className="order-2 md:order-1 h-11 text-xs">Back</Button>
                                <Button onClick={handlePaymentConfirm} className="order-1 md:order-2 flex-[2] h-11 text-xs uppercase tracking-widest">Confirm Transaction</Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>

                      <div className="lg:col-span-1">
                        <Card className="p-5 md:p-6 sticky top-6">
                           <h4 className="text-xs md:text-sm font-bold text-white mb-4 md:mb-6 uppercase tracking-widest italic border-b border-white/5 pb-3">Order Summary</h4>
                           <div className="space-y-3 mb-8 md:mb-10">
                              <div className="flex justify-between items-center text-[9px] md:text-[10px]">
                                <span className="font-bold text-text-muted uppercase tracking-tight">Program</span>
                                <span className="font-bold text-white uppercase tracking-tight">{formatCurrency(selectedTier?.size || 0)} Challenge</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] md:text-[10px]">
                                <span className="font-bold text-text-muted uppercase tracking-tight">Broker</span>
                                <span className="text-white font-bold uppercase tracking-tight">{checkoutData.broker}</span>
                              </div>
                              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">Total</span>
                                <span className="text-lg md:text-xl font-bold text-brand-primary leading-none">{formatCurrency(selectedTier?.price || 0)}</span>
                              </div>
                           </div>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {checkoutStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-primary/10 border border-brand-primary/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      >
                        <ShieldCheck className="w-10 h-10 text-brand-primary" />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase italic tracking-tight">Network Verification</h3>
                    <p className="text-slate-400 text-sm max-w-sm font-semibold uppercase tracking-tight">Our automated validator is scanning the blockchain for your transaction hash.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* --- Success Page --- */}
          {currentPage === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key="success"
              className="p-4 md:p-10 flex items-center justify-center min-h-[60vh]"
            >
              <Card className="max-w-md w-full text-center p-8 md:p-12 border-emerald-500/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                   <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 uppercase italic tracking-tight">Payment Verified</h2>
                <p className="text-slate-400 text-xs md:text-sm mb-8 md:mb-10 leading-relaxed font-semibold uppercase tracking-tight">
                  credentials will be delivered to your inbox shortly.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => { setUser({ email: checkoutData.email!, fullName: checkoutData.fullName! }); setCurrentPage('dashboard'); }} className="w-full h-11 text-xs">Access Dashboard</Button>
                  <Button variant="ghost" onClick={() => setCurrentPage('welcome')} className="w-full text-xs">Return Home</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* --- Auth Page --- */}
          {currentPage === 'auth' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-20 flex items-center justify-center min-h-[70vh]"
            >
              <Card className="max-w-md w-full p-8 md:p-12 border-white/5 bg-brand-secondary">
                <div className="text-center mb-10">
                  <Logo className="justify-center mb-6" />
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Trader Portal</h3>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-2">Sign in using Passkey technology</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Gmail Account</label>
                    <input 
                      type="email" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@gmail.com" 
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-primary transition-all shadow-inner" 
                    />
                  </div>

                  <div className="flex items-center gap-3 px-1">
                    <button 
                      onClick={() => setTermsAccepted(!termsAccepted)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all",
                        termsAccepted ? "bg-brand-primary border-brand-primary shadow-[0_0_10px_rgba(56,189,248,0.3)]" : "border-white/10 hover:border-white/20"
                      )}
                    >
                      {termsAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                    </button>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-tight">I accept Terms & Conditions</span>
                  </div>

                  <Button 
                    onClick={handlePasskeySignUp} 
                    disabled={!authEmail || !termsAccepted || isAuthLoading}
                    className="w-full h-14 uppercase tracking-[0.2em] text-xs relative overflow-hidden group"
                  >
                    {isAuthLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : isAuthSuccess ? (
                      <div className="flex items-center gap-3 text-black">
                        <CheckCircle2 className="w-5 h-5 animate-in zoom-in" />
                        <span>Success</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Passkey Sign In</span>
                      </div>
                    )}
                  </Button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.15em] leading-relaxed">
                    By continuing, you agree to our <br />
                    <button onClick={() => setCurrentPage('privacy')} className="text-brand-primary hover:underline">Privacy Policy</button> and <button onClick={() => setCurrentPage('privacy')} className="text-brand-primary hover:underline">Terms of Service</button>
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
          {/* --- Dashboard Page --- */}
          {currentPage === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="dashboard"
              className="p-4 md:p-10"
            >
              {user && (
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Welcome Back,</h3>
                    <p className="text-brand-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Account Level</p>
                      <p className="text-xs font-black text-white uppercase tracking-widest">{purchasedAccounts.length > 0 ? 'Verified Trader' : 'Observer'}</p>
                    </div>
                  </div>
                </div>
              )}
              {purchasedAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic mb-2 tracking-tight">No Active Assets</h3>
                  <p className="text-text-muted text-xs font-semibold uppercase leading-relaxed mb-8 tracking-widest">Your portfolio is empty. Purchase a funding model and complete verification to see your accounts here.</p>
                  <Button onClick={() => setCurrentPage('models')} className="w-full">Explore Programs</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                    <Card className="p-5 md:p-6">
                      <div className="flex justify-between items-center mb-3 md:mb-4">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Combined Balance</span>
                        <BarChart3 className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-white italic leading-none">{formatCurrency(purchasedAccounts.reduce((acc, curr) => acc + curr.size, 0))}</div>
                    </Card>
                    <Card className="p-5 md:p-6 border-emerald-500/20">
                      <div className="flex justify-between items-center mb-3 md:mb-4">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Accounts</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-white italic leading-none">{purchasedAccounts.length}</div>
                    </Card>
                    <Card className="p-5 md:p-6">
                      <div className="flex justify-between items-center mb-3 md:mb-4">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Next Payout</span>
                        <Zap className="w-4 h-4 text-brand-accent" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-white italic leading-none">7 Days</div>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                       <h4 className="text-xs font-bold text-white uppercase italic tracking-widest">Portfolio Tracking</h4>
                    </div>
                    <div className="overflow-x-auto border border-border-subtle rounded-2xl bg-card-bg">
                      <table className="w-full text-left text-xs uppercase font-bold tracking-tighter">
                        <thead>
                          <tr className="border-b border-border-subtle bg-white/[0.02]">
                            <th className="px-6 py-4 text-text-muted font-black">Plan</th>
                            <th className="px-6 py-4 text-text-muted font-black">Size</th>
                            <th className="px-6 py-4 text-text-muted font-black">Status</th>
                            <th className="px-6 py-4 text-text-muted font-black">Drawdown</th>
                            <th className="px-6 py-4 text-text-muted font-black">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchasedAccounts.map((account, i) => (
                            <tr key={i} className="border-b border-border-subtle/50 hover:bg-white/[0.01] transition-colors">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  {account.id.includes('instant') ? <Zap className="w-3 h-3 text-emerald-500" /> : <Trophy className="w-3 h-3 text-brand-primary" />}
                                  <span>{account.id.includes('instant') ? 'Instant' : 'Challenge'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-white">{formatCurrency(account.size)}</td>
                              <td className="px-6 py-5 text-emerald-500">Live Trade</td>
                              <td className="px-6 py-5 text-rose-500">None</td>
                              <td className="px-6 py-5 underline uppercase tracking-widest cursor-pointer hover:text-white">Credentials</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* --- FAQ Page --- */}
          {currentPage === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-20 max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Knowledge Base</h3>
                <p className="text-text-muted text-[10px] md:text-xs uppercase font-bold tracking-[0.2em]">Everything you need to know about trading with QXT FUNDED</p>
              </div>

              <div className="space-y-6">
                {FAQ_ITEMS.map((item, i) => (
                  <Card key={i} className="p-6 md:p-8 bg-white/[0.01] hover:bg-white/[0.02] transition-colors border-white/5">
                    <h4 className="text-sm md:text-lg font-black text-white uppercase italic mb-3 tracking-tight flex items-center gap-3">
                      <span className="text-brand-primary font-black">?</span> {item.question}
                    </h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold uppercase tracking-tight">
                      {item.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- Privacy Page --- */}
          {currentPage === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-20 max-w-3xl mx-auto"
            >
              <div className="mb-16">
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Legal & Compliance</h3>
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-8">Transparency and trust are our top priorities.</p>
              </div>

              <div className="space-y-16">
                <section>
                  <h4 className="text-lg font-black text-brand-primary uppercase italic mb-6 tracking-widest">Privacy Policy</h4>
                  <div className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold uppercase tracking-tight whitespace-pre-line">
                    {LEGAL_CONTENT.privacyPolicy}
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-black text-brand-emerald uppercase italic mb-6 tracking-widest">Terms of Service</h4>
                  <div className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold uppercase tracking-tight whitespace-pre-line">
                    {LEGAL_CONTENT.termsConditions}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Persistent global notification widget has been removed as per user request */}
      <AnimatePresence>
        {false && notification && (
          <Notification message={notification} onClose={() => setNotification(null)} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-4">
        <a href={`mailto:${PLATFORM_CONFIG.supportEmail}`} className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
          <HelpCircle className="w-7 h-7 text-white" />
          <span className="absolute left-full ml-4 whitespace-nowrap bg-slate-900 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">Contact Support</span>
        </a>
      </div>
    </div>
  </div>
);
}
