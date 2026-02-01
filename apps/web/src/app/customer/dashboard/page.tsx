"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LogOut, User, Mail, Phone, Shield,
    PlusCircle, ListChecks, LayoutDashboard,
    Settings, Bell, Search, Sparkles, Clock, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { customerService } from "@/lib/api/customer.service";
import type { CustomerRequest } from "@/lib/types/customer";

export default function CustomerDashboard() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const { user, logout } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<CustomerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await customerService.getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setIsLoading(false);
        }
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return "text-emerald-400 bg-emerald-400/10";
            case "IN_PROGRESS": return "text-blue-400 bg-blue-400/10";
            case "NEW": return "text-amber-400 bg-amber-400/10";
            case "CANCELLED": return "text-red-400 bg-red-400/10";
            default: return "text-white/60 bg-white/5";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return <CheckCircle2 className="w-4 h-4" />;
            case "IN_PROGRESS": return <Clock className="w-4 h-4" />;
            case "NEW": return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            {/* Main Background: Consistent with your provided screenshot base [#E0F2F1] */}
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative overflow-hidden font-sans">
                
                {/* Subtle Kinetic Accents using the palette electric blues */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Customer Glass Header --- */}
                <motion.header 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">Customer Portal</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Premium Textiles Network</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">Account Status: Active</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:text-[#0077B6] transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span>Sign Out</span>
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
                        variants={fadeInUp}
                        className="lg:col-span-4 bg-[#001D29] rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[600px]"
                    >
                        <div className="relative z-10 space-y-12">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                    <div className="w-full h-full rounded-[1.8rem] bg-[#001D29] flex items-center justify-center">
                                        <span className="text-4xl font-bold text-[#48CAE4]">{user?.name?.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#48CAE4] rounded-2xl flex items-center justify-center border-4 border-[#001D29] shadow-lg">
                                    <Shield className="w-4 h-4 text-[#001D29]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">{user?.name}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#48CAE4] opacity-80">Verified Member: {user?.role}</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Mail className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Phone className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Mobile Contact</p>
                                        <p className="text-sm font-medium text-white/90">{user?.phone || "Private Registry"}</p>
                                    </div>
                                </div>
<<<<<<< HEAD
                            </motion.section>

                            {/* Quick Actions & Feed (Right) */}
                            <div className="lg:col-span-2 space-y-8">
                                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => router.push('/customer/inventory')}
                                        className="group p-6 bg-[#00B4D8] rounded-[2rem] text-[#001D29] flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#00B4D8]/20">
                                        <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                                            <PlusCircle className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">Show Inventory</div>
                                            <div className="text-xs opacity-70">Browse available items</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => router.push('/customer/requests')}
                                        className="group p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 transition-all hover:bg-white/10 active:scale-95"
                                    >
                                        <div className="p-3 bg-[#0077B6]/20 rounded-2xl group-hover:scale-110 transition-transform text-[#00B4D8]">
                                            <ListChecks className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">My Requests</div>
                                            <div className="text-xs text-white/40">Track progress</div>
                                        </div>
                                    </button>
                                </motion.div>

                                <motion.div
                                    id="request-history"
                                    variants={itemVariants}
                                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
                                >
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        Recent Activity
                                        <div className="h-1.5 w-1.5 bg-[#00B4D8] rounded-full animate-pulse" />
                                    </h3>
                                    <div className="space-y-4">
                                        {isLoading ? (
                                             <div className="flex justify-center p-8">
                                                <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                                             </div>
                                        ) : requests.length > 0 ? (
                                            requests.map((req) => (
                                                <div 
                                                    key={req.id}
                                                    onClick={() => router.push(`/customer/requests/${req.id}` as any)}
                                                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-xl ${getStatusColor(req.status)}`}>
                                                            {getStatusIcon(req.status)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm">
                                                                {req.payload?.type ? req.payload.type.toUpperCase() : "REQUEST"} #{req.id.slice(0, 8)}
                                                            </h4>
                                                            <p className="text-xs text-white/40 pt-1">
                                                                {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${getStatusColor(req.status)}`}>
                                                            {req.status}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 text-white/20 text-sm justify-center">
                                                No recent transactions found.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
=======
>>>>>>> 2448972bef6adb5193acb41ee70df43ae73917fd
                            </div>
                        </div>

                        {/* Visual Watermark consistent with brand identity */}
                        <div className="absolute bottom-[-2rem] right-[-2rem] opacity-5 pointer-events-none select-none">
                            <Layers className="w-64 h-64 text-white -rotate-12" />
                        </div>
                    </motion.section>

                    {/* RIGHT COLUMN: Interaction Module */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.section variants={fadeInUp} className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-serif font-bold italic text-[#001D29] tracking-wide">Account Overview</h3>
                                <div className="h-[1px] flex-1 bg-[#001D29]/10 mx-6" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Primary Action: Show Inventory using Electric Blue [#0077B6] */}
                                <button 
                                    onClick={() => router.push('/customer/inventory')}
                                    className="group relative p-8 bg-[#0077B6] rounded-[2.5rem] shadow-xl shadow-[#0077B6]/20 transition-all hover:scale-[1.02] active:scale-98 overflow-hidden text-left"
                                >
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <PlusCircle className="w-10 h-10 text-[#48CAE4] mb-8 transition-transform group-hover:rotate-90" />
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">Show <br/> Inventory</h4>
                                            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#48CAE4] opacity-80">Browse Available Items</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-white/30 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {/* My Requests: Secondary Action */}
                                <button className="group relative p-8 bg-white border border-[#001D29]/5 rounded-[2.5rem] shadow-lg shadow-[#001D29]/05 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 text-left">
                                    <ListChecks className="w-10 h-10 text-[#0077B6] mb-8 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="text-2xl font-black text-[#001D29] uppercase leading-none tracking-tighter">My <br/> Requests</h4>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#0077B6]">Track Project Status</p>
                                    </div>
                                </button>

                                {/* Mini Controls Grid */}
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { title: "Dashboard", icon: LayoutDashboard, desc: "Main View" },
                                        { title: "Notifications", icon: Bell, desc: "System Alerts" },
                                        { title: "Settings", icon: Settings, desc: "Adjust Account" }
                                    ].map((item, i) => (
                                        <button key={i} className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-sm border border-[#001D29]/5 rounded-[2rem] hover:bg-white transition-all group">
                                            <item.icon className="w-6 h-6 text-[#0077B6] mb-3 group-hover:rotate-12 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#001D29]">{item.title}</span>
                                            <span className="text-[8px] font-bold text-[#0077B6]/60 uppercase mt-1">{item.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Recent Activity Module */}
                        <motion.section 
                            variants={fadeInUp}
                            className="bg-white/60 backdrop-blur-sm border border-[#001D29]/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[#001D29] rounded-2xl shadow-lg">
                                    <Activity className="w-8 h-8 text-[#48CAE4] animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#001D29] uppercase tracking-tight text-lg">Recent Activity</h4>
                                    <p className="text-xs text-[#001D29]/60 font-medium">No recent transactions or status changes found in your registry.</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 bg-[#0077B6] rounded-full opacity-30" />
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </motion.main>
            </div>

            {/* --- Global Custom Scrollbar --- */}
            <style jsx global>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(0, 180, 216, 0.1); border-radius: 10px; }
            `}</style>
        </ProtectedRoute>
    );
}