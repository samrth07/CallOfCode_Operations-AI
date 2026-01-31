"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { UserRole } from "@/lib/types/auth";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Lock, User, Phone, MapPin, Wrench,
    Users, Briefcase, ShieldCheck, ArrowRight, Loader2,
    CheckCircle2, Eye, EyeOff, Scissors
} from "lucide-react";

export default function SignupPage() {
    // --- Logic: Preserved Exactly ---
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        skills: "",
    });

    const { registerCustomer, registerWorker, registerOwner, isLoading } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            toast.error("Please fill in all required fields");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (selectedRole === UserRole.CUSTOMER && !formData.address) {
            toast.error("Address is required for customers");
            return false;
        }
        if (selectedRole === UserRole.WORKER && !formData.skills) {
            toast.error("Skills are required for workers");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            switch (selectedRole) {
                case UserRole.CUSTOMER:
                    await registerCustomer({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        password: formData.password,
                    });
                    break;
                case UserRole.WORKER:
                    await registerWorker({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                        password: formData.password,
                    });
                    break;
                case UserRole.OWNER:
                    await registerOwner({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                    });
                    break;
            }
            toast.success("Account created successfully!");
            switch (selectedRole) {
                case UserRole.CUSTOMER: router.push("/customer/dashboard"); break;
                case UserRole.WORKER: router.push("/worker/dashboard"); break;
                case UserRole.OWNER: router.push("/owner/dashboard"); break;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Signup failed");
        }
    };

    // --- Design: Updated Color Palette (Deep Sea / Electric Blue) ---
    return (
        <div className="min-h-screen w-full bg-[#001D29] flex items-center justify-center p-4 lg:p-10 relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0096C7] rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#00B4D8] rounded-full blur-[100px] opacity-10" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row bg-[#002535] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
            >
                {/* Branding Panel */}
                <div className="w-full lg:w-[35%] bg-gradient-to-br from-[#001D29] to-[#0077B6] p-10 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <motion.div 
                            whileHover={{ rotate: 180 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="w-14 h-14 bg-[#00B4D8] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20"
                        >
                            <Scissors className="text-white w-7 h-7" />
                        </motion.div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-serif font-bold leading-tight tracking-tight">Create <br/> <span className="text-[#48CAE4] italic font-normal">Account</span></h1>
                            <p className="text-[#95D5B2] text-sm font-medium leading-relaxed max-w-[200px] opacity-80">Join the MSME Clothes Center and connect with artisan heritage.</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="relative z-10 hidden lg:block">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#48CAE4] mb-4">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Registration 2026</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ x: ["-100%", "0%"] }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full w-full bg-[#00B4D8]" 
                            />
                        </div>
                    </div>

                    <span className="absolute -bottom-10 -left-10 text-[150px] font-serif font-black text-white/5 pointer-events-none select-none">
                        MSME
                    </span>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-8 lg:p-16 h-full max-h-[85vh] overflow-y-auto custom-scrollbar bg-white/5 backdrop-blur-3xl">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12">
                        
                        {/* Section: Role Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00B4D8] ml-1">Account Path</label>
                            <div className="flex flex-wrap gap-3">
                                {Object.values(UserRole).map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setSelectedRole(role)}
                                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                                            selectedRole === role 
                                            ? "bg-[#0077B6] border-[#0077B6] text-white shadow-lg -translate-y-0.5" 
                                            : "border-white/5 bg-white/5 text-[#00B4D8] hover:border-[#00B4D8]/50"
                                        }`}
                                    >
                                        {role.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section: Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-white">
                            <div className="md:col-span-2 flex items-center gap-4">
                                <h3 className="font-serif text-xl font-bold">Personal Details</h3>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>

                            {[
                                { id: "name", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
                                { id: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "john@example.com" },
                                { id: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1..." },
                            ].map((field) => (
                                <div key={field.id} className="relative border-2 border-white/5 rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white/5 group">
                                    <label className="absolute -top-3 left-4 bg-[#002535] px-2 text-[9px] font-black text-[#00B4D8] uppercase tracking-widest group-focus-within:text-white">
                                        {field.label}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <field.icon className="w-4 h-4 text-[#0077B6]" />
                                        <input
                                            name={field.id}
                                            type={field.type}
                                            value={formData[field.id as keyof typeof formData]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-white font-medium text-sm placeholder:text-white/20"
                                            placeholder={field.placeholder}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Adaptive Role-Specific Fields */}
                            <AnimatePresence mode="wait">
                                {selectedRole === UserRole.CUSTOMER && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                        className="relative border-2 border-white/5 rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white/5 group md:col-span-1"
                                    >
                                        <label className="absolute -top-3 left-4 bg-[#002535] px-2 text-[9px] font-black text-[#00B4D8] uppercase tracking-widest group-focus-within:text-white">Address</label>
                                        <div className="flex items-start gap-3 pt-1">
                                            <MapPin className="w-4 h-4 text-[#0077B6] mt-1" />
                                            <textarea name="address" rows={1} value={formData.address} onChange={handleChange} className="w-full bg-transparent outline-none text-white font-medium text-sm resize-none placeholder:text-white/20" placeholder="123 Street, City" required />
                                        </div>
                                    </motion.div>
                                )}
                                {selectedRole === UserRole.WORKER && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                        className="relative border-2 border-white/5 rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white/5 group md:col-span-1"
                                    >
                                        <label className="absolute -top-3 left-4 bg-[#002535] px-2 text-[9px] font-black text-[#00B4D8] uppercase tracking-widest group-focus-within:text-white">Skills</label>
                                        <div className="flex items-center gap-3">
                                            <Wrench className="w-4 h-4 text-[#0077B6]" />
                                            <input name="skills" type="text" value={formData.skills} onChange={handleChange} className="w-full bg-transparent outline-none text-white font-medium text-sm placeholder:text-white/20" placeholder="Tailoring, Design..." required />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="md:col-span-2 flex items-center gap-4 mt-4">
                                <h3 className="font-serif text-xl font-bold">Security</h3>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>

                            {/* Password Fields */}
                            {[
                                { id: "password", label: "Password", show: showPassword, set: setShowPassword },
                                { id: "confirmPassword", label: "Confirm Password", show: showConfirmPassword, set: setShowConfirmPassword }
                            ].map((pass) => (
                                <div key={pass.id} className="relative border-2 border-white/5 rounded-2xl p-4 focus-within:border-[#00B4D8] transition-all bg-white/5 group">
                                    <label className="absolute -top-3 left-4 bg-[#002535] px-2 text-[9px] font-black text-[#00B4D8] uppercase tracking-widest group-focus-within:text-white">{pass.label}</label>
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-4 h-4 text-[#0077B6]" />
                                        <input
                                            name={pass.id}
                                            type={pass.show ? "text" : "password"}
                                            value={formData[pass.id as keyof typeof formData]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-white font-medium text-sm placeholder:text-white/20"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button type="button" onClick={() => pass.set(!pass.show)} className="text-white/30 hover:text-white transition-colors">
                                            {pass.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="space-y-6 pt-6 text-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-[#00B4D8] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-[#0096C7] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Enrollment <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>}
                            </button>
                            
                            <p className="text-[10px] text-[#00B4D8] font-bold tracking-widest uppercase">
                                Already a member?{" "}
                                <Link href="/auth/login" className="text-white underline underline-offset-4 decoration-[#00B4D8] hover:decoration-white transition-all">
                                    Enter Gallery
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #0077B6; border-radius: 10px; }
            `}</style>
        </div>
    );
}