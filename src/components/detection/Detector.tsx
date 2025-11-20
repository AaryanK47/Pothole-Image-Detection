import React, { useRef, useEffect } from 'react';
import { Camera, RotateCcw, Scan } from 'lucide-react';
import { useDetector } from '../../hooks/useDetector';
import { Button, Card } from '../ui/utils';
import { type DetectionBox } from '../../utils/simulation';

interface DetectorProps {
    detector: ReturnType<typeof useDetector>;
}

export const Detector: React.FC<DetectorProps> = ({ detector }) => {
    const {
        imageSrc, setImageSrc, isProcessing, detections, processImage
    } = detector;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (imageSrc && canvasRef.current) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageSrc;
            img.onload = () => {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d')!;

                const maxWidth = 800;
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                processImage(canvas);
            };
        }
    }, [imageSrc, processImage]);

    useEffect(() => {
        if (!canvasRef.current || !imageSrc) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            detections.forEach((box: DetectionBox) => {
                // Glowing Box
                ctx.shadowColor = '#ff003c';
                ctx.shadowBlur = 15;
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff003c';
                ctx.strokeRect(box.x, box.y, box.w, box.h);

                // Reset shadow for text
                ctx.shadowBlur = 0;

                // Tech Label
                ctx.fillStyle = 'rgba(255, 0, 60, 0.9)';
                ctx.fillRect(box.x, box.y - 24, 120, 24);

                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px "JetBrains Mono", monospace';
                ctx.fillText(`POTHOLE ${(box.confidence * 100).toFixed(0)}%`, box.x + 6, box.y - 8);

                // Corner accents
                const len = 10;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(box.x, box.y + len);
                ctx.lineTo(box.x, box.y);
                ctx.lineTo(box.x + len, box.y);
                ctx.stroke();
            });
        };
    }, [detections, imageSrc]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImageSrc(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="relative overflow-hidden flex flex-col h-full min-h-[600px] glass border-0 ring-1 ring-white/10 shadow-2xl">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 border-[20px] border-transparent border-t-slate-900/50 border-b-slate-900/50"></div>
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-xs font-mono text-red-500 font-bold tracking-widest">LIVE FEED</span>
            </div>

            {/* Scanning Line */}
            {imageSrc && !isProcessing && (
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-neon-blue/10 to-transparent animate-scan h-[20%] w-full"></div>
            )}

            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md relative z-30">
                <h2 className="font-bold text-white flex items-center gap-3">
                    <Scan className="w-5 h-5 text-neon-blue" />
                    Visual Analysis
                </h2>
                {imageSrc && (
                    <Button
                        onClick={() => setImageSrc(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-mono"
                    >
                        <RotateCcw className="w-3 h-3 mr-2 inline" /> RESET FEED
                    </Button>
                )}
            </div>

            <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {!imageSrc ? (
                    <div
                        className="text-center cursor-pointer group relative z-10"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mx-auto mb-6 group-hover:border-neon-blue group-hover:scale-110 transition-all duration-300 bg-slate-900/50">
                            <Camera className="w-10 h-10 text-slate-500 group-hover:text-neon-blue transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Initialize Scan</h3>
                        <p className="text-slate-500 text-sm mt-2 font-mono">Drop image or click to browse</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden border border-white/10">
                        <canvas ref={canvasRef} className="max-w-full max-h-[600px] block" />

                        {isProcessing && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-40">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_#00f3ff]"></div>
                                    <span className="font-mono text-neon-blue animate-pulse tracking-widest">PROCESSING DATA...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
