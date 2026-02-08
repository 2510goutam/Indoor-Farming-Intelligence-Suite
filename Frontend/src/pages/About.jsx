import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Rocket, Heart, ChevronRight } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';

const About = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />

            <main className="pt-32 px-8 max-w-5xl mx-auto pb-20">
                <header className="text-center mb-20">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-6">Our Mission</h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                        We are democratizing indoor farming by providing advanced AI tools and a transparent marketplace to farmers worldwide.
                    </p>
                </header>

                <div className="grid gap-12">
                    <VisionCard
                        icon={Target}
                        title="The Problem"
                        desc="New farmers often face high entry barriers: lack of technical knowledge, fragmented information, and difficulty in connecting with reliable vendors."
                    />
                    <VisionCard
                        icon={Rocket}
                        title="Our Solution"
                        desc="A centralized dashboard integrating AI-powered consultations, real-time environment management, and a seamless seeds-to-crops marketplace."
                    />
                    <VisionCard
                        icon={Heart}
                        title="Community First"
                        desc="We believe in building a sustainable ecosystem where every farmer, regardless of scale, has the tools to succeed and flourish."
                    />
                </div>

                <div className="mt-24 p-12 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 blur-[80px] -z-10" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Ready to transform your farming journey?</h2>
                    <Link to="/register" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black text-lg hover:gap-4 transition-all uppercase tracking-widest">
                        Join 1000+ farmers today <ChevronRight className="w-6 h-6" />
                    </Link>
                </div>
            </main>
        </div>
    );
};

const VisionCard = ({ icon: Icon, title, desc }) => (
    <div className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/5 transition-all">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <Icon className="text-primary-600 dark:text-primary-400 w-8 h-8" />
        </div>
        <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">{desc}</p>
        </div>
    </div>
);

export default About;
