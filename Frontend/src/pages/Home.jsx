import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />


      <section className="pt-32 pb-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-8 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Generation Farming</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Cultivate the <span className="text-grad-primary">Future</span> <br /> from Your Screens.
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            A complete ecosystem for aeroponic and hydroponic farming management, powered by Generative AI and real-time monitoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="grad-primary px-10 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 group shadow-2xl shadow-primary-500/30 text-white">
              {isAuthenticated ? "My Dashboard" : "Start Your Farm"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="bg-white px-10 py-4 rounded-2xl text-lg font-bold border border-slate-200 hover:border-primary-500/50 hover:bg-slate-50 transition-all shadow-md text-slate-700">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="AI Consultation"
            desc="Get expert advice on costs, crop selection, and profitability through our Next-Gen AI."
          />
          <FeatureCard
            icon={Shield}
            title="Smart Monitoring"
            desc="Real-time environmental tracking for temperature, humidity, and nutrients."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Market Access"
            desc="Bridge the gap between farmers and vendors. Buy seeds and sell harvests instantly."
          />
        </div>
      </section>

      <section className="py-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <Stat text="Entry Barrier Reduced" value="60%" />
          <Stat text="Yield Increase" value="35%" />
          <Stat text="Survival Rate" value="95%" />
          <Stat text="Transaction Costs" value="-40%" />
        </div>
      </section>

      <footer className="py-12 px-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
        <p>&copy; 2026 Indoor Farming Intelligence Suite. Built with passion for sustainable agriculture.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/10 transition-all group">
    <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon className="text-primary-600 dark:text-primary-400 w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Stat = ({ value, text }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{text}</div>
  </div>
);

export default Home;
