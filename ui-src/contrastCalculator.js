// contrastCalculator.ts
export function calculateWCAGContrast(foreground, background) {
    const fgRGB = hexToRGB(foreground);
    const bgRGB = hexToRGB(background);
    const fgLuminance = calculateLuminance(fgRGB);
    const bgLuminance = calculateLuminance(bgRGB);
    const contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
        (Math.min(fgLuminance, bgLuminance) + 0.05);
    return Number(contrastRatio.toFixed(2));
}
function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}
function calculateLuminance([r, g, b]) {
    const [rL, gL, bL] = [r, g, b].map(c => {
        if (c <= 0.03928) {
            return c / 12.92;
        }
        return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}
export function getWCAGLevel(contrastRatio) {
    if (contrastRatio >= 7) {
        return 'AAA';
    }
    else if (contrastRatio >= 4.5) {
        return 'AA';
    }
    else if (contrastRatio >= 3) {
        return 'AA Large';
    }
    else {
        return 'Fail';
    }
}
// Placeholder for APCA calculation
export function calculateAPCAContrast(foreground, background) {
    // APCA calculation to be implemented
    return 0;
}
