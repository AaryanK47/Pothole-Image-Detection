import { Detector } from './components/detection/Detector';
import { useDetector } from './hooks/useDetector';
import { Cpu } from 'lucide-react';
import { Card } from './components/ui/utils';

function App() {
  const detector = useDetector();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black font-sans text-slate-200 selection:bg-neon-blue/30 flex flex-col items-center justify-center p-6">

      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1800px] flex flex-col items-center gap-8">

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple tracking-tight text-center drop-shadow-[0_0_15px_rgba(0,243,255,0.3)] py-2">
          IMAGE POTHOLE DETECTION USING CNN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          {/* Main Detection Area - Takes up 3 columns */}
          <div className="lg:col-span-3 h-[800px] glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <Detector detector={detector} />
          </div>

          {/* Parameter Tuning - Takes up 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Potholes Detected Card */}
            <Card className="glass p-6 border-l-4 border-l-neon-red">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-lg">
                <div className="w-3 h-3 rounded-full bg-neon-red animate-pulse" />
                Potholes Detected
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-white tracking-tighter text-glow">
                  {detector.detections.length}
                </span>
                <span className="text-sm text-slate-400 mb-2 font-mono">THREATS FOUND</span>
              </div>
            </Card>

            <Card className="glass p-8 border-t-4 border-t-neon-blue h-full">
              <h3 className="font-bold text-white mb-8 flex items-center gap-3 text-xl">
                <Cpu className="w-6 h-6 text-neon-blue" />
                Parameter Tuning
              </h3>

              <div className="space-y-10">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-base font-medium text-slate-300">Sensitivity Threshold</label>
                    <span className="text-sm font-mono text-neon-blue border border-neon-blue/30 px-2 py-1 rounded bg-neon-blue/10">{detector.sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={detector.sensitivity}
                    onChange={(e) => detector.setSensitivity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-base font-medium text-slate-300">Minimum Blob Size</label>
                    <span className="text-sm font-mono text-neon-blue border border-neon-blue/30 px-2 py-1 rounded bg-neon-blue/10">{detector.minSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10" max="100"
                    value={detector.minSize}
                    onChange={(e) => detector.setMinSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
