"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { UserRole } from "@/lib/types/auth";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Users, Briefcase, ShieldCheck, ArrowRight, Loader2, Compass, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await login({ email, password, role: selectedRole });

            toast.success("Login successful!");

            // Redirect based on role
            switch (selectedRole) {
                case UserRole.CUSTOMER:
                    router.push("/customer/dashboard");
                    break;
                case UserRole.WORKER:
                    router.push("/worker/dashboard");
                    break;
                case UserRole.OWNER:
                    router.push("/owner/dashboard");
                    break;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed");
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.CUSTOMER:
                return <Users className="w-4 h-4" />;
            case UserRole.WORKER:
                return <Briefcase className="w-4 h-4" />;
            case UserRole.OWNER:
                return <ShieldCheck className="w-4 h-4" />;
        }
    };

    const getRoleDescription = (role: UserRole) => {
        switch (role) {
            case UserRole.CUSTOMER:
                return "Access customer portal";
            case UserRole.WORKER:
                return "Manage tasks and work";
            case UserRole.OWNER:
                return "Admin dashboard";
        }
    };

    // --- DESIGN: ORGANIC FLOATING MODULAR (BLUE THEME) ---
    return (
        <div className="min-h-screen w-full bg-[#E0F2F1] flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Aesthetic: Deep Blue Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative w-full max-w-5xl flex flex-col md:flex-row gap-4 items-center">
                
                {/* Left Panel: The Branding Shield (Midnight Blue) */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full md:w-1/3 bg-[#001D29] rounded-tr-[5rem] rounded-bl-[5rem] p-10 flex flex-col justify-between h-[520px] shadow-2xl shadow-[#001D29]/40"
                >
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-[#00B4D8] rounded-full flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
                            <Compass className="text-[#001D29] w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-serif text-white leading-tight font-bold">
                            MSME <br /> 
                            <span className="text-[#48CAE4] italic text-3xl font-normal tracking-tight">Clothes Center</span>
                        </h1>
                    </div>
                    <div>
                        <p className="text-[#00B4D8] text-[10px] font-black uppercase tracking-[0.4em] opacity-80 italic">Digital Textiles Network</p>
                        <div className="mt-4 h-1 w-20 bg-[#0077B6]" />
                    </div>
                </motion.div>

                {/* Right Panel: The Entry Module */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 bg-white rounded-tl-[5rem] rounded-br-[5rem] p-8 md:p-14 shadow-[0_40px_80px_-20px_rgba(0,29,41,0.15)] border border-[#CAF0F8] relative overflow-hidden"
                >
                    {/* Role Selector: Pill Bubbles */}
                    <div className="space-y-3 mb-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6] ml-1">Select Identity</label>
                        <div className="flex flex-wrap gap-3">
                            {Object.values(UserRole).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 flex items-center gap-2 ${
                                        selectedRole === role 
                                        ? "bg-[#0077B6] border-[#0077B6] text-white shadow-lg -translate-y-0.5" 
                                        : "border-[#CAF0F8] bg-[#F0F9FF] text-[#001D29] hover:border-[#00B4D8]/50"
                                    }`}
                                >
                                    {getRoleIcon(role)}
                                    {role.toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#0077B6]/60 italic ml-1">
                            {getRoleDescription(selectedRole)}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Email Field: Framed Style */}
                            <div className="relative border-2 border-[#F0F9FF] rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white group">
                                <label className="absolute -top-3 left-4 bg-white px-2 text-[9px] font-black text-[#0077B6] uppercase tracking-widest group-focus-within:text-[#00B4D8]">
                                    Identity Mail
                                </label>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[#00B4D8]" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent outline-none text-[#001D29] font-medium text-sm placeholder:text-[#001D29]/20"
                                        placeholder="user@clothes.msme"
                                    />
                                </div>
                            </div>

                            {/* Password Field: Framed Style */}
                            <div className="relative border-2 border-[#F0F9FF] rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white group">
                                <label className="absolute -top-3 left-4 bg-white px-2 text-[9px] font-black text-[#0077B6] uppercase tracking-widest group-focus-within:text-[#00B4D8]">
                                    Access Code
                                </label>
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-[#00B4D8]" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent outline-none text-[#001D29] font-medium text-sm placeholder:text-[#001D29]/20"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#0077B6] hover:text-[#001D29] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-[#001D29] text-[#48CAE4] rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-[#002535] hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate Entry</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 flex items-center justify-between text-[10px] font-bold text-[#0077B6] tracking-[0.1em]">
                        <Link 
                            href="/auth/signup" 
                            className="text-[#0077B6] border-b border-[#CAF0F8] pb-0.5 hover:border-[#0077B6] transition-all"
                        >
                            Register Identity
                        </Link>
                        <span className="opacity-40 uppercase">v. 2026.0</span>
                    </div>
                </motion.div>
            </div>

            {/* Background Graphic Text */}
            <div className="fixed bottom-0 right-10 rotate-[-90deg] origin-bottom-right hidden lg:block pointer-events-none opacity-[0.05]">
                <span className="text-[180px] font-serif font-black text-[#001D29] leading-none select-none uppercase tracking-tighter">Oceanic</span>
            </div>
        </div>
    );
}