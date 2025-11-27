import React, { useState, useRef } from 'react';
import {
    BarChart, Bar, AreaChart, Area, ResponsiveContainer
} from 'recharts';
import {
    Bell, Search, Menu, Home, Settings, User,
    ShoppingCart, CreditCard, ArrowUpRight, ArrowDownRight,
    MoreHorizontal, Calendar, CheckCircle, Mail, Globe, Shield,
    ChevronRight, Plus, Activity, Wallet, Target, Play, SkipForward, SkipBack, Heart, Music, Lock,
    Type, Layers, Sparkles, Trash2, GripHorizontal, Wand2, Loader2, Copy, Moon, Sun
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const expData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 600 },
    { name: 'Mar', value: 450 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 750 },
];

const simpleLineData = [
    { value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 600 }, { value: 500 }, { value: 700 }
]

// --- Base Component ---

const Card: React.FC<{ className?: string, children: React.ReactNode, onDelete?: () => void, dragHandleProps?: any }> = ({ className, children, onDelete, dragHandleProps }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 relative group ${className}`}>
        {onDelete && (
            <div className="absolute top-2 right-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="p-1.5 bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 rounded-md shadow-sm border border-slate-200 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        )}
        {dragHandleProps && (
            <div
                {...dragHandleProps}
                className="absolute top-2 left-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1.5 bg-white/90 backdrop-blur text-slate-400 rounded-md shadow-sm border border-slate-200"
            >
                <GripHorizontal size={14} />
            </div>
        )}
        {children}
    </div>
);

// --- Content Components (Updated to mix Primary & Secondary) ---

const VisualCard: React.FC<{ title: string, subtitle?: string, image: string, theme: 'primary' | 'secondary' }> = ({ title, subtitle, image, theme }) => (
    <div className="relative h-full w-full group cursor-pointer overflow-hidden rounded-xl">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

        {/* Gradient Overlay - Color Tint */}
        <div className={`absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply`}></div>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80`}></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h3 className="text-xl font-bold text-white mb-0.5 transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-1">{title}</h3>
            {subtitle && <p className="text-white/80 text-xs font-medium">{subtitle}</p>}
            <div className="h-1 w-8 bg-white/30 rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
        </div>
    </div>
);

const SvgShowcase = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
                {/* Dynamic SVG that uses the generated palette */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <circle cx="50" cy="50" r="45" className="fill-primary-100" />
                    <path d="M50 20 L80 80 L20 80 Z" className="fill-primary-500 transition-colors duration-300" />
                    <circle cx="50" cy="55" r="15" className="fill-white" />
                    <path d="M50 45 L55 60 L45 60 Z" className="fill-primary-800" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Dynamic Brand Icon</h3>
            <p className="text-xs text-slate-500">SVG fills update automatically</p>
        </div>
    </div>
);

const ExpenseChartCard = () => (
    <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Expenses</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">$12,543</h3>
            </div>
            <div className="bg-primary-50 p-2 rounded-lg text-primary-600 hover:bg-secondary-100 hover:text-secondary-600 transition-colors cursor-pointer">
                <MoreHorizontal size={20} />
            </div>
        </div>
        <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expData}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary-500)" />
                            <stop offset="100%" stopColor="var(--color-secondary-500)" />
                        </linearGradient>
                    </defs>
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
    </div>
);

const StatCard: React.FC<{ title: string, amount: string, trend: string, theme: 'primary' | 'secondary' }> = ({ title, amount, trend, theme }) => (
    <div className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</p>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{amount}</h4>
                <div className="flex items-center gap-1 mt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600`}>
                        <ArrowUpRight size={10} />
                    </div>
                    <p className="text-[10px] text-slate-400">{trend} last period</p>
                </div>
            </div>
        </div>
        <div className="h-16 -mx-2 opacity-80 hover:opacity-100 transition-opacity mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simpleLineData}>
                    <defs>
                        <linearGradient id={`grad${title}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--color-secondary-500)" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-primary-500)"
                        fill={`url(#grad${title})`}
                        strokeWidth={2}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const CategoryList = () => (
    <div className="p-2 h-full">
        <div className="p-4 pb-2 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">Categories</h3>
            <button className="text-primary-600 text-xs font-bold hover:bg-primary-50 px-2 py-1 rounded-md transition-colors">See All</button>
        </div>
        <div className="space-y-1">
            {[
                { name: 'Groceries', count: '9 transactions', icon: ShoppingCart, bg: 'bg-primary-100', color: 'text-primary-600' },
                { name: 'Household', count: '12 transactions', icon: Home, bg: 'bg-secondary-100', color: 'text-secondary-600' },
                { name: 'Travel', count: '6 transactions', icon: Globe, bg: 'bg-gradient-to-br from-primary-100 to-secondary-100', color: 'text-primary-700' },
                { name: 'Other', count: '4 transactions', icon: Target, bg: 'bg-slate-100', color: 'text-slate-600' },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.count}</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                </div>
            ))}
        </div>
    </div>
);

const TodoCard = () => (
    <div className="p-5 bg-white dark:bg-slate-900 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Todo List</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">3 Active</span>
        </div>
        <div className="space-y-3 flex-1">
            {[
                { text: "Process clients feedback", time: "Today", checked: true, color: "bg-secondary-500", border: "border-secondary-500" },
                { text: "Design 5 alternative hero sections", time: "Tomorrow", checked: false, color: "bg-primary-500", border: "border-primary-500" },
                { text: "Design system meeting", time: "In 2 days", checked: false, color: "bg-gradient-to-b from-primary-400 to-secondary-400", border: "border-primary-400" },
            ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl border-l-4 ${item.border} ${item.checked ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800 shadow-sm'} flex gap-3 group hover:shadow-md transition-all`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${item.checked ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 group-hover:border-primary-400'}`}>
                        {item.checked && <CheckCircle size={12} />}
                    </div>
                    <div>
                        <p className={`text-sm font-medium transition-colors ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400'}`}>{item.text}</p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar size={10} /> {item.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const GradientShowcase = () => (
    <div className="p-1 h-full min-h-[16rem] flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 text-white p-6">
            <h3 className="text-3xl font-bold mb-2">Gradient Magic</h3>
            <p className="opacity-90 text-sm mb-6">Seamlessly blend your primary and secondary colors.</p>
            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-primary-600 transition-all">
                Get CSS Code
            </button>
        </div>
        {/* Abstract shapes */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
    </div>
);

const LoginCard = () => (
    <div className="p-8 flex flex-col justify-center h-full">
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl mx-auto mb-3 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <Lock size={20} />
            </div>
            <h3 className="font-bold text-xl text-slate-800 dark:text-white">Welcome Back</h3>
            <p className="text-slate-400 text-xs mt-1">Please enter your details</p>
        </div>
        <div className="space-y-4">
            <div className="relative group">
                <input type="email" placeholder="Email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" />
                <Mail size={14} className="absolute right-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <div className="relative group">
                <input type="password" placeholder="Password" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" />
                <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-slate-300 group-focus-within:bg-secondary-500 transition-colors"></div>
            </div>
            <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold py-2 rounded-lg text-sm shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.02]">
                Sign In
            </button>
            <p className="text-center text-[10px] text-slate-400 cursor-pointer hover:text-primary-600 transition-colors">Forgot password?</p>
        </div>
    </div>
);

const MusicPlayerCard = () => (
    <div className="relative h-full overflow-hidden text-white flex flex-col justify-end p-6">
        <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=600&q=80" alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="font-bold text-lg">Midnight City</h3>
                    <p className="text-white/60 text-xs">M83 • Hurry Up, We're Dreaming</p>
                </div>
                <button className="text-primary-400 hover:text-secondary-400 transition-colors">
                    <Heart size={20} fill="currentColor" />
                </button>
            </div>
            {/* Progress */}
            <div className="w-full bg-white/20 h-1 rounded-full mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-400 to-secondary-400 h-full w-2/3 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow"></div>
                </div>
            </div>
            {/* Controls */}
            <div className="flex justify-between items-center px-4">
                <SkipBack size={20} className="text-white/70 hover:text-white cursor-pointer" />
                <div className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-white/20">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
                <SkipForward size={20} className="text-white/70 hover:text-white cursor-pointer" />
            </div>
        </div>
    </div>
)

const TypographyCard = () => (
    <div className="p-6 flex flex-col justify-between h-full">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600">
                    <Type size={16} />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Typography & Gradients</h3>
            </div>

            <h1 className="text-4xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500">
                Design with purpose
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-6">
                Create stunning user interfaces with color palettes that <span className="text-secondary-600 font-semibold border-b-2 border-secondary-200">speak your language</span>.
            </p>

            <div className="flex gap-3 mb-6">
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
                    Get Started
                </button>
                <button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Learn More
                </button>
            </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">AA Large</span>
                <span className="text-xs font-mono text-slate-400">4.52:1</span>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-2"></div>
            <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 border-2 border-white shadow-sm -ml-1"></div>
                <div className="h-8 w-8 rounded-full bg-primary-300 border-2 border-white shadow-sm -ml-4"></div>
                <div className="h-8 w-8 rounded-full bg-primary-500 border-2 border-white shadow-sm -ml-4"></div>
                <div className="h-8 w-8 rounded-full bg-secondary-500 border-2 border-white shadow-sm -ml-4"></div>
            </div>
        </div>
    </div>
)

const CustomAICard: React.FC<{ prompt: string, html?: string }> = ({ prompt, html }) => {
    if (html) {
        return (
            <div
                className="w-full h-full [&_svg]:inline-block"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return (
        <div className="p-6 flex flex-col h-full justify-between relative overflow-hidden bg-white dark:bg-slate-900">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-primary-500">
                <Sparkles size={100} />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
                        <Sparkles size={10} /> AI Generated
                    </span>
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white capitalize leading-tight">{prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}</h3>
                <p className="text-slate-500 text-xs mt-2 italic">"{prompt}"</p>
            </div>
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 border-dashed">
                <div className="h-2 w-2/3 bg-primary-200 rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-secondary-200 rounded mb-2"></div>
                <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
            </div>
            <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-transform">
                    Action
                </button>
            </div>
        </div>
    )
}

const PricingCard = () => (
    <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-primary-500 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
        </div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">MOST POPULAR</span>
                <Heart size={20} className="text-white/80" />
            </div>

            <h3 className="text-2xl font-bold mb-1">MacBook Pro</h3>
            <p className="text-white/80 text-sm mb-4">14 inch, M3 Pro Chip</p>

            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">$1,999</span>
                <span className="text-white/60 text-sm line-through">$2,199</span>
            </div>
        </div>

        <div className="relative z-10">
            <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                Shop now <ArrowUpRight size={16} />
            </button>
            <p className="text-center text-[10px] text-white/60 mt-3">Free shipping worldwide</p>
        </div>
    </div>
);

const DiscountCard = () => (
    <div className="p-6 h-full flex flex-col justify-center bg-white dark:bg-slate-900 relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-100 dark:bg-secondary-900/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-primary-50 dark:bg-primary-900/30 rounded-full group-hover:scale-150 transition-transform duration-500 delay-75"></div>

        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Get discount<br />on purchases</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Save up to 30% on your first order with our exclusive code.</p>

            <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-dashed rounded-lg flex items-center justify-center font-mono text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                    SAVE30
                </div>
                <button className="p-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <Copy size={18} />
                </button>
            </div>
        </div>
    </div>
);

const ButtonShowcase = () => (
    <div className="p-6 h-full flex flex-col justify-center gap-4 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Button States</h3>
            <span className="text-[10px] font-mono text-slate-400">UI KIT</span>
        </div>

        <div className="space-y-3">
            <button className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                Primary Action
            </button>

            <button className="w-full py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-secondary-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                Secondary Action
            </button>

            <button className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary-500 hover:text-primary-600 rounded-lg font-bold text-sm transition-all">
                Outline Button
            </button>

            <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg font-bold text-sm cursor-not-allowed">
                    Disabled
                </button>
                <button className="w-10 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                    <Plus size={18} />
                </button>
            </div>
        </div>
    </div>
);

const ProfileCardVariant = () => (
    <div className="h-full relative overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" alt="Daniel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-800/50 to-transparent flex flex-col justify-end p-6 mix-blend-multiply opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
            <h3 className="text-2xl font-bold text-white">Daniel Johnson</h3>
            <p className="text-white/90 text-sm mb-4">Lead Product Designer</p>
            <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors border border-white/20">
                    <Mail size={14} />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-primary-600 transition-colors border border-white/20">
                    <Globe size={14} />
                </button>
                <button className="ml-auto px-3 py-1.5 bg-white text-primary-900 text-xs font-bold rounded-full hover:bg-primary-50 transition-colors flex items-center gap-1 shadow-lg">
                    Follow <Plus size={12} />
                </button>
            </div>
        </div>
    </div>
);

// --- Registry & Types ---

type CardType = 'visual' | 'chart' | 'list' | 'stat' | 'profile' | 'todo' | 'gradient' | 'login' | 'music' | 'typography' | 'custom' | 'pricing' | 'discount' | 'remote' | 'buttons' | 'profile-variant' | 'svg';

interface CardData {
    id: string;
    type: CardType;
    props?: any;
    colSpan?: number; // 1 (default) or 2
    rowSpan?: number; // 1 (default) or 2
    height?: string; // class name
}

const DEFAULT_CARDS: CardData[] = [
    // { id: '1', type: 'visual', colSpan: 2, rowSpan: 2, props: { title: "Track expenses", subtitle: "Manage your finances", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80", theme: "primary" } },
    { id: '2', type: 'chart', colSpan: 1, rowSpan: 1 },
    { id: '4', type: 'list', rowSpan: 2 },
    { id: '6', type: 'stat', props: { title: "Income", amount: "$15,969", trend: "+24%", theme: "primary" } },
    { id: '11', type: 'profile-variant', rowSpan: 1 },
    { id: '12', type: 'todo', rowSpan: 1 },
    { id: '13', type: 'buttons', colSpan: 1 },
    { id: '14', type: 'pricing', rowSpan: 2 },
    { id: '15', type: 'discount', colSpan: 1 },
    { id: '17', type: 'svg', colSpan: 1 },
    { id: '10', type: 'gradient', colSpan: 2 },
];

const renderCardContent = (type: CardType, props: any = {}) => {
    switch (type) {
        case 'visual': return <VisualCard {...props} />;
        case 'chart': return <ExpenseChartCard />;
        case 'stat': return <StatCard {...props} />;
        case 'list': return <CategoryList />;
        case 'todo': return <TodoCard />;
        case 'gradient': return <GradientShowcase />;
        case 'login': return <LoginCard />;
        case 'music': return <MusicPlayerCard />;
        case 'typography': return <TypographyCard />;
        case 'custom': return <CustomAICard prompt={props.prompt} html={props.html} />;
        case 'pricing': return <PricingCard />;
        case 'discount': return <DiscountCard />;
        case 'buttons': return <ButtonShowcase />;
        case 'profile-variant': return <ProfileCardVariant />;
        case 'svg': return <SvgShowcase />;
        default: return <div className="p-4 text-slate-400">Card type {type} not implemented</div>;
    }
}

// --- Layouts ---

export const UiExampleGrid: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>(DEFAULT_CARDS);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const newCards = [...cards];
        const draggedItem = newCards[draggedItemIndex];
        newCards.splice(draggedItemIndex, 1);
        newCards.splice(index, 0, draggedItem);

        setCards(newCards);
        setDraggedItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const handleDelete = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemPrompt = `
            You are an expert Tailwind CSS UI generator.
            Create a responsive, beautiful HTML snippet for a UI card component based on the user's description.
            
            RULES:
            1. Return ONLY the raw HTML string. No markdown code blocks, no \`\`\`, no explanations.
            2. The HTML will be rendered inside a container with 'h-full w-full bg-white rounded-2xl overflow-hidden'.
            3. Use the following dynamic Tailwind color classes for theming:
               - Primary colors: 'primary-50' to 'primary-950' (e.g., bg-primary-600, text-primary-700).
               - Secondary colors: 'secondary-50' to 'secondary-950'.
               - Neutrals: 'slate-50' to 'slate-900'.
            4. If icons are needed, embed raw <svg> tags with class="w-4 h-4" or similar. Do not use external icon libraries.
            5. Make it look modern, clean, and professional.
            
            User Description: "${aiPrompt}"
          `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemPrompt,
            });

            const generatedHtml = response.text;

            const newCard: CardData = {
                id: Date.now().toString(),
                type: 'custom',
                props: { prompt: aiPrompt, html: generatedHtml },
                colSpan: 1
            };

            setCards([newCard, ...cards]);
            setAiPrompt('');
        } catch (error) {
            console.error("AI Generation failed:", error);
            alert("Failed to generate UI. Please check API key configuration.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full">
            {/* AI Generator Bar */}
            <div className="mb-10 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                    <Wand2 size={24} />
                </div>
                <div className="flex-1 w-full">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Magic Card Generator</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Describe a UI component and AI will add it to your grid.</p>
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. 'Pricing card for pro plan'..."
                        className="flex-1 md:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white dark:placeholder-slate-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                    />
                    <button
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Generating
                            </>
                        ) : (
                            <>Generate <Plus size={16} /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Masonry-like Grid with Spans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 auto-rows-[minmax(180px,auto)] grid-flow-dense">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`
                        transition-all duration-300 ease-in-out
                        ${draggedItemIndex === index ? 'opacity-40 scale-95' : 'opacity-100'}
                        ${card.colSpan === 2 ? 'md:col-span-2' : 'col-span-1'}
                        ${card.rowSpan === 2 ? 'row-span-2' : 'row-span-1'}
                    `}
                    >
                        <Card
                            className="h-full"
                            onDelete={() => handleDelete(card.id)}
                            dragHandleProps={{
                            }}
                        >
                            {renderCardContent(card.type, card.props)}
                        </Card>
                    </div>
                ))}
            </div>

            {/* Carousel / Marquee Section */}
            <div className="py-12 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-center font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs mb-10">More Examples from the Library</h3>
                <div className="relative overflow-hidden w-full group">
                    <div className="flex gap-8 animate-scroll whitespace-nowrap w-max hover:[animation-play-state:paused] py-4">
                        {[...Array(2)].map((_, setIndex) => (
                            <React.Fragment key={setIndex}>
                                {/* Card Item 1 */}
                                <div className="w-72 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-5 inline-block whitespace-normal align-top hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                                            <Activity size={20} />
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">+24%</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">Activity</h4>
                                    <p className="text-slate-400 text-sm mt-1">Weekly engagement stats</p>
                                    <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full w-3/4 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Card Item 2 */}
                                <div className="w-72 bg-gradient-to-br from-primary-600 to-secondary-700 rounded-xl shadow-lg shadow-primary-500/30 p-5 inline-block whitespace-normal align-top hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                            <Wallet size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-medium">Total Balance</p>
                                            <p className="font-bold text-lg">$24,500.00</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="flex-1 bg-white text-primary-700 text-xs font-bold py-2 rounded-lg">Deposit</button>
                                        <button className="flex-1 bg-white/10 text-white text-xs font-bold py-2 rounded-lg border border-white/10 hover:bg-white/20">Send</button>
                                    </div>
                                </div>

                                {/* Card Item 3 */}
                                <div className="w-72 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-0 inline-block whitespace-normal align-top hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                                    <div className="h-24 bg-gradient-to-r from-secondary-100 to-primary-100 dark:from-secondary-900/40 dark:to-primary-900/40 relative">
                                        <div className="absolute -bottom-6 left-5 w-12 h-12 bg-white dark:bg-slate-800 rounded-full p-1">
                                            <div className="w-full h-full bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold">JD</div>
                                        </div>
                                    </div>
                                    <div className="pt-8 px-5 pb-5">
                                        <h4 className="font-bold text-slate-800 dark:text-white">John Doe</h4>
                                        <p className="text-slate-400 text-xs">Software Engineer</p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold">React</span>
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold">Tailwind</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Item 4 - Dark Mode preview */}
                                <div className="w-72 bg-slate-900 rounded-xl shadow-lg p-5 inline-block whitespace-normal align-top hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-white">Dark Mode</h4>
                                        <div className="w-8 h-4 bg-primary-500 rounded-full relative">
                                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                                        <div className="h-2 bg-slate-800 rounded w-full"></div>
                                        <div className="h-2 bg-slate-800 rounded w-5/6"></div>
                                    </div>
                                    <button className="mt-4 w-full py-2 border border-slate-700 text-primary-400 text-xs font-bold rounded-lg hover:bg-slate-800">Preview</button>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Duplicate for infinite scroll effect */}
                        <div className="w-72 bg-white rounded-xl shadow-md border border-slate-100 p-5 inline-block whitespace-normal align-top hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                    <Activity size={20} />
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">+24%</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg">Activity</h4>
                            <p className="text-slate-400 text-sm mt-1">Weekly engagement stats</p>
                            <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full w-3/4 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    {/* Fade edges */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent pointer-events-none z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none z-10"></div>
                </div>
                <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
            </div>
        </div>
    );
};