"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    LogOut, User, Mail, Phone, Shield, 
    ClipboardList, Calendar, History, 
    Bell, Scissors, ArrowRight, Activity, Sparkles, Layers
} from "lucide-react";

export default function WorkerDashboard() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeInUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.WORKER, UserRole.OWNER]}>
            {/* Main Background: Consistent with your provided screenshot base */}
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative overflow-hidden font-sans">
                
                {/* Subtle Kinetic Accents using the palette electric blues */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Artisan Glass Header --- */}
                <motion.header 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Scissors className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">MSME Artisan Station</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Professional Network 2026</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">System Online</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:text-red-500 transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </motion.header>

                {/* --- Main Grid Architecture --- */}
                <motion.main 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-7xl grid lg:grid-cols-12 gap-8 items-start"
                >
                    {/* LEFT COLUMN: Identity Monolith (Styled like login panel) */}
                    <motion.section 
                        variants={itemVariants}
                        className="lg:col-span-4 bg-[#001D29] rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[550px]"
                    >
                        <div className="relative z-10 space-y-12">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                    <div className="w-full h-full rounded-[1.8rem] bg-[#001D29] flex items-center justify-center">
                                        <User className="w-10 h-10 text-[#48CAE4]" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#48CAE4] rounded-2xl flex items-center justify-center border-4 border-[#001D29] shadow-lg">
                                    <Shield className="w-4 h-4 text-[#001D29]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">{user?.name}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#48CAE4] opacity-80">Identity: {user?.role}</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Mail className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Registered Mail</p>
                                        <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Phone className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Contact Line</p>
                                        <p className="text-sm font-medium text-white/90">{user?.phone || "Private Registry"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Watermark consistent with login panel */}
                        <div className="absolute bottom-[-2rem] right-[-2rem] opacity-5 pointer-events-none select-none">
                            <Layers className="w-64 h-64 text-white -rotate-12" />
                        </div>
                    </motion.section>

                    {/* RIGHT COLUMN: Task Management Modules */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.section variants={itemVariants} className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-serif font-bold italic text-[#001D29] tracking-wide">Operational Workflow</h3>
                                <div className="h-[1px] flex-1 bg-[#001D29]/10 mx-6" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Assigned Tasks: Styled with palette electric blue */}
                                <button className="group relative p-8 bg-[#0077B6] rounded-[2.5rem] shadow-xl shadow-[#0077B6]/20 transition-all hover:scale-[1.02] active:scale-98 overflow-hidden text-left">
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <ClipboardList className="w-10 h-10 text-[#48CAE4] mb-8 transition-transform group-hover:rotate-6" />
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">Assigned <br/> Tasks</h4>
                                            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#48CAE4] opacity-80">View Current Queue</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-white/30 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {/* Set Availability */}
                                <button className="group relative p-8 bg-white border border-[#001D29]/5 rounded-[2.5rem] shadow-lg shadow-[#001D29]/05 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 text-left">
                                    <Calendar className="w-10 h-10 text-[#0077B6] mb-8 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="text-2xl font-black text-[#001D29] uppercase leading-none tracking-tighter">Work <br/> Schedule</h4>
                                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#0077B6]">Update Availability</p>
                                    </div>
                                </button>
                            </div>
                        </motion.section>

                        {/* History Archive Module */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white/60 backdrop-blur-sm border border-[#001D29]/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[#001D29] rounded-2xl">
                                    <History className="w-8 h-8 text-[#48CAE4]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#001D29] uppercase tracking-tight text-lg">Task History</h4>
                                    <p className="text-xs text-[#001D29]/60 font-medium">Review and verify all completed operational records.</p>
                                </div>
                            </div>
                            <button className="px-8 py-3 bg-[#001D29] text-[#48CAE4] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#0077B6] hover:text-white transition-all">
                                Open Archive
                            </button>
                        </motion.div>

                        {/* System Health Decor */}
                        <motion.div variants={itemVariants} className="flex justify-center gap-2 opacity-40">
                             <Sparkles className="w-4 h-4 text-[#0077B6]" />
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#001D29]">Artisan Station 2.0 Secure</span>
                        </motion.div>
                    </div>
                </motion.main>
            </div>
        </ProtectedRoute>
    );
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};