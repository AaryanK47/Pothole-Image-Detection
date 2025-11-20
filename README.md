# 🛣️ Image Pothole Detection Using CNN

> A high-performance, privacy-focused web application for real-time pothole detection using client-side AI.

![Project Banner](https://via.placeholder.com/1200x600/0f172a/00f3ff?text=RoadGuard+AI+Detection)

## 🚀 Overview

This project is a modern web application designed to detect potholes in images using advanced Computer Vision techniques. Unlike traditional cloud-based solutions, this app runs **entirely in the browser** using WebAssembly (WASM) and ONNX Runtime. This ensures zero latency, maximum privacy (no data upload), and offline capability.

It features a dual-mode detection engine:
1.  **YOLOv8 Neural Engine**: State-of-the-art deep learning model for precise object detection.
2.  **Simulation Algorithm**: A custom heuristic-based algorithm using geometric filtering and thresholding for lightweight analysis.

## ✨ Key Features

-   **Client-Side AI**: Powered by `onnxruntime-web`, enabling neural networks to run directly in Chrome/Edge without a backend.
-   **Privacy First**: No images are ever uploaded to a server. All processing happens locally on the user's device.
-   **Dual Detection Modes**: Switch seamlessly between AI-based (YOLO) and Algorithmic (Simulation) detection.
-   **Advanced UI/UX**: A premium, glassmorphism-inspired interface built with Tailwind CSS, featuring neon accents and smooth animations.
-   **Smart Filtering**: Implements **Non-Maximum Suppression (NMS)** and geometric heuristics (aspect ratio, solidity) to reduce false positives.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **AI & ML**: ONNX Runtime Web, YOLOv8 (converted to .onnx)
-   **Performance**: WebAssembly (WASM) for near-native inference speed

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pothole-detection-app.git
    cd pothole-detection-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 💡 How It Works

1.  **Upload**: User drops an image onto the analysis zone.
2.  **Preprocessing**: The image is resized and normalized (0-1 range) in a canvas.
3.  **Inference**:
    -   *YOLO Mode*: The ONNX model predicts bounding boxes and confidence scores.
    -   *Simulation Mode*: Pixel intensity analysis identifies dark regions, which are then filtered by shape and density.
4.  **Post-Processing**: Overlapping boxes are merged using NMS, and the final results are drawn on the HUD overlay.

## 👨‍💻 Author

Built with ❤️ by [Your Name]
