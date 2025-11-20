import { LayoutDashboard, Settings, AlertTriangle, FileText, Github, Activity } from 'lucide-react';
import { cn } from '../ui/utils';

export const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: AlertTriangle, label: 'Detections', active: false },
        { icon: FileText, label: 'Reports', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-white/5">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-blue blur-lg opacity-50"></div>
                        <div className="w-10 h-10 bg-slate-900 rounded-xl border border-neon-blue/50 flex items-center justify-center relative z-10">
                            <Activity className="text-neon-blue w-6 h-6" />
                        </div>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        RoadGuard
                    </span>
                </h1>
                <div className="mt-2 flex items-center gap-2 px-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                    <p className="text-xs text-neon-green font-mono uppercase tracking-wider">System Online</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                            item.active
                                ? "text-white"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        {item.active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent border-l-2 border-neon-blue"></div>
                        )}
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            item.active ? "text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" : "group-hover:text-white"
                        )} />
                        <span className="relative z-10">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5">
                <div className="glass p-4 rounded-xl group cursor-pointer hover:border-neon-purple/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors">
                            <Github className="w-5 h-5 text-slate-400 group-hover:text-neon-purple" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white group-hover:text-neon-purple transition-colors">Open Source</p>
                            <p className="text-xs text-slate-500 font-mono">v2.0.0-beta</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
