import * as ort from 'onnxruntime-web';
import { type DetectionBox } from './simulation';

// Helper to load the model
export const loadModel = async (modelFile: File): Promise<ort.InferenceSession> => {
    const buffer = await modelFile.arrayBuffer();
    const session = await ort.InferenceSession.create(buffer, { executionProviders: ['wasm'] });
    return session;
};

// Preprocess image for YOLO (Resize, Normalize, CHW layout)
const preprocess = (ctx: CanvasRenderingContext2D, width: number, height: number, targetSize: number = 640): Float32Array => {
    // Draw resized image to a temp canvas or just sample
    // For simplicity, we'll assume the input context is already the image we want to process
    // But YOLO needs 640x640 usually.

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetSize;
    tempCanvas.height = targetSize;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error("Failed to create temp canvas");

    tempCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, targetSize, targetSize);
    const imageData = tempCtx.getImageData(0, 0, targetSize, targetSize);
    const { data } = imageData;

    const float32Data = new Float32Array(3 * targetSize * targetSize);

    // HWC -> CHW and Normalize (0-255 -> 0-1)
    for (let i = 0; i < targetSize * targetSize; i++) {
        const r = data[i * 4] / 255.0;
        const g = data[i * 4 + 1] / 255.0;
        const b = data[i * 4 + 2] / 255.0;

        float32Data[i] = r; // Red channel
        float32Data[i + targetSize * targetSize] = g; // Green channel
        float32Data[i + 2 * targetSize * targetSize] = b; // Blue channel
    }

    return float32Data;
};

// Postprocess YOLO output
// This is a simplified version. Real YOLOv8 output is [1, 84, 8400] usually (cx, cy, w, h, class_probs...)
const postprocess = (output: Float32Array, _imgWidth: number, _imgHeight: number, _targetSize: number = 640): DetectionBox[] => {
    const boxes: DetectionBox[] = [];
    // Mock implementation for now since we don't have the exact model output shape without the model.
    // In a real scenario, we would parse the output tensor, apply NMS, and scale boxes back to imgWidth/imgHeight.

    console.warn("YOLO post-processing is a placeholder. Needs specific model output shape.", output.length);

    return boxes;
};

export const runYoloInference = async (
    session: ort.InferenceSession,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): Promise<DetectionBox[]> => {
    const targetSize = 640;
    const inputTensor = new ort.Tensor('float32', preprocess(ctx, width, height, targetSize), [1, 3, targetSize, targetSize]);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = inputTensor;

    const results = await session.run(feeds);
    const output = results[session.outputNames[0]].data as Float32Array;

    return postprocess(output, width, height, targetSize);
};
