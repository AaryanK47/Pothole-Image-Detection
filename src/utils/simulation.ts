export interface DetectionBox {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    confidence: number;
}

export const runSimulation = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    sensitivity: number,
    minSize: number
): DetectionBox[] => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Grid based detection (Optimization)
    const gridSize = 10;
    const gridW = Math.ceil(width / gridSize);
    const gridH = Math.ceil(height / gridSize);
    const grid = new Int8Array(gridW * gridH).fill(0); // 0 = road, 1 = potential pothole

    // Step 1: Thresholding (Feature Extraction)
    const threshold = sensitivity * 2.55; // Convert 0-100 to 0-255

    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            let darkPixelCount = 0;
            let totalPixels = 0;

            // Sample pixels within the grid cell
            for (let dy = 0; dy < gridSize; dy++) {
                for (let dx = 0; dx < gridSize; dx++) {
                    const px = x + dx;
                    const py = y + dy;
                    if (px >= width || py >= height) continue;

                    const i = (py * width + px) * 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Simple grayscale luminance
                    const brightness = (r + g + b) / 3;

                    if (brightness < threshold) {
                        darkPixelCount++;
                    }
                    totalPixels++;
                }
            }

            // If cell is significantly dark, mark it
            if (darkPixelCount > (totalPixels * 0.4)) {
                const gx = Math.floor(x / gridSize);
                const gy = Math.floor(y / gridSize);
                grid[gy * gridW + gx] = 1;
            }
        }
    }

    // Step 2: Connected Component Labeling (Object Detection)
    const visited = new Int8Array(gridW * gridH).fill(0);
    const boxes: DetectionBox[] = [];

    const getGridIdx = (gx: number, gy: number) => gy * gridW + gx;

    for (let gy = 0; gy < gridH; gy++) {
        for (let gx = 0; gx < gridW; gx++) {
            const idx = getGridIdx(gx, gy);

            if (grid[idx] === 1 && visited[idx] === 0) {
                // Start a flood fill to find the extent of this "blob"
                let minX = gx, maxX = gx, minY = gy, maxY = gy;
                const queue = [[gx, gy]];
                visited[idx] = 1;
                let size = 0;

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift()!;
                    size++;

                    minX = Math.min(minX, cx);
                    maxX = Math.max(maxX, cx);
                    minY = Math.min(minY, cy);
                    maxY = Math.max(maxY, cy);

                    // Check neighbors
                    const neighbors = [
                        [cx + 1, cy], [cx - 1, cy],
                        [cx, cy + 1], [cx, cy - 1]
                    ];

                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
                            const nIdx = getGridIdx(nx, ny);
                            if (grid[nIdx] === 1 && visited[nIdx] === 0) {
                                visited[nIdx] = 1;
                                queue.push([nx, ny]);
                            }
                        }
                    }
                }

                // Filter out small noise and geometric anomalies
                const width = (maxX - minX + 1) * gridSize;
                const height = (maxY - minY + 1) * gridSize;
                const area = width * height;
                const aspectRatio = width / height;

                // Calculate solidity (approximate based on grid cells vs bounding box area)
                // size is the number of active grid cells. Each cell is gridSize*gridSize.
                const blobArea = size * (gridSize * gridSize);
                const solidity = blobArea / area;

                const isPotholeLike =
                    size > (minSize / 10) && // Size check
                    aspectRatio > 0.3 && aspectRatio < 3.0 && // Aspect ratio check (not too thin)
                    solidity > 0.4; // Solidity check (not too sparse)

                if (isPotholeLike) {
                    boxes.push({
                        x: minX * gridSize,
                        y: minY * gridSize,
                        w: width,
                        h: height,
                        label: 'Pothole',
                        confidence: 0.85 + Math.random() * 0.1 // Fake confidence for simulation
                    });
                }
            }
        }
    }

    // Step 3: Merge overlapping boxes (Simple NMS)
    return mergeBoxes(boxes, 0.1); // Low threshold to merge nearby boxes aggressively
};

const mergeBoxes = (boxes: DetectionBox[], iouThreshold: number): DetectionBox[] => {
    if (boxes.length === 0) return [];

    // Sort by size (descending) to prioritize larger boxes
    boxes.sort((a, b) => (b.w * b.h) - (a.w * a.h));

    const merged: DetectionBox[] = [];
    const active = new Array(boxes.length).fill(true);

    for (let i = 0; i < boxes.length; i++) {
        if (!active[i]) continue;

        const boxA = boxes[i];
        let finalBox = { ...boxA };
        let count = 1;

        for (let j = i + 1; j < boxes.length; j++) {
            if (!active[j]) continue;

            const boxB = boxes[j];
            if (getIoU(finalBox, boxB) > iouThreshold) {
                // Merge B into finalBox
                const minX = Math.min(finalBox.x, boxB.x);
                const minY = Math.min(finalBox.y, boxB.y);
                const maxX = Math.max(finalBox.x + finalBox.w, boxB.x + boxB.w);
                const maxY = Math.max(finalBox.y + finalBox.h, boxB.y + boxB.h);

                finalBox.x = minX;
                finalBox.y = minY;
                finalBox.w = maxX - minX;
                finalBox.h = maxY - minY;

                active[j] = false;
                count++;
            }
        }
        merged.push(finalBox);
    }

    return merged;
};

const getIoU = (boxA: DetectionBox, boxB: DetectionBox): number => {
    const xA = Math.max(boxA.x, boxB.x);
    const yA = Math.max(boxA.y, boxB.y);
    const xB = Math.min(boxA.x + boxA.w, boxB.x + boxB.w);
    const yB = Math.min(boxA.y + boxA.h, boxB.y + boxB.h);

    const interW = Math.max(0, xB - xA);
    const interH = Math.max(0, yB - yA);

    const interArea = interW * interH;
    const boxAArea = boxA.w * boxA.h;
    const boxBArea = boxB.w * boxB.h;

    return interArea / (boxAArea + boxBArea - interArea);
};
