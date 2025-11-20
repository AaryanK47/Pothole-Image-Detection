import { useState, useCallback } from 'react';
import { type DetectionBox, runSimulation } from '../utils/simulation';
import { loadModel, runYoloInference } from '../utils/yolo';
import * as ort from 'onnxruntime-web';

export type DetectionMode = 'simulation' | 'yolo';

export const useDetector = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detections, setDetections] = useState<DetectionBox[]>([]);
    const [mode, setMode] = useState<DetectionMode>('simulation');
    const [modelSession, setModelSession] = useState<ort.InferenceSession | null>(null);
    const [sensitivity, setSensitivity] = useState(45);
    const [minSize, setMinSize] = useState(20);

    const processImage = useCallback(async (canvas: HTMLCanvasElement) => {
        if (!canvas) return;
        setIsProcessing(true);

        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let boxes: DetectionBox[] = [];

            if (mode === 'simulation') {
                boxes = runSimulation(ctx, canvas.width, canvas.height, sensitivity, minSize);
            } else if (mode === 'yolo' && modelSession) {
                boxes = await runYoloInference(modelSession, ctx, canvas.width, canvas.height);
            }

            setDetections(boxes);
        } catch (error) {
            console.error("Detection failed", error);
        } finally {
            setIsProcessing(false);
        }
    }, [mode, modelSession, sensitivity, minSize]);

    const loadYoloModel = async (file: File) => {
        try {
            setIsProcessing(true);
            const session = await loadModel(file);
            setModelSession(session);
            setMode('yolo');
        } catch (error) {
            console.error("Failed to load model", error);
            alert("Failed to load ONNX model. Check console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        imageSrc,
        setImageSrc,
        isProcessing,
        detections,
        mode,
        setMode,
        sensitivity,
        setSensitivity,
        minSize,
        setMinSize,
        processImage,
        loadYoloModel,
        isModelLoaded: !!modelSession
    };
};
