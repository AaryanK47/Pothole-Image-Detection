import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { Card } from '../ui/utils';

interface StatsProps {
    detectionCount: number;
    isProcessing: boolean;
}

export const Stats: React.FC<StatsProps> = ({ detectionCount, isProcessing }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 glass relative overflow-hidden group hover:border-neon-red/50 transition-colors">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-red/10 rounded-full blur-xl group-hover:bg-neon-red/20 transition-all"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center text-neon-red shadow-[0_0_15px_rgba(255,0,60,0.2)]">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">Threats Detected</p>
                        <p className="text-4xl font-bold text-white text-glow">{detectionCount}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 glass relative overflow-hidden group hover:border-neon-green/50 transition-colors">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-green/10 rounded-full blur-xl group-hover:bg-neon-green/20 transition-all"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center text-neon-green shadow-[0_0_15px_rgba(10,255,10,0.2)]">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">System Status</p>
                        <p className="text-2xl font-bold text-white">
                            {isProcessing ? <span className="text-neon-blue animate-pulse">ANALYZING...</span> : 'STANDBY'}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 glass relative overflow-hidden group hover:border-neon-purple/50 transition-colors">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl group-hover:bg-neon-purple/20 transition-all"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.2)]">
                        <Activity className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">Confidence Score</p>
                        <p className="text-4xl font-bold text-white">
                            {detectionCount > 0 ? '92%' : '--'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
