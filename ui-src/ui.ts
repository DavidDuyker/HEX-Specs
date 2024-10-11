import { calculateWCAGContrast, getWCAGLevel, calculateAPCAContrast } from './contrastCalculator';

let foregroundColor: string = '#000000';
let backgroundColor: string = '#FFFFFF';
let contrast: number | null = null;
let selectionMode: "none" | "foreground" | "background" = "none";

function updateColor(color: string, type: 'foreground' | 'background'): void {
    if (type === 'foreground') {
        foregroundColor = color;
    } else {
        backgroundColor = color;
    }
    calculateContrast();
    updateUIColors();
}

function calculateContrast(): void {
  const wcagContrast = calculateWCAGContrast(foregroundColor, backgroundColor);
  const wcagLevel = getWCAGLevel(wcagContrast);
  
  const wcagTextElement = document.getElementById('WCAGtext');
  if (wcagTextElement) {
    wcagTextElement.textContent = `${wcagContrast}`;
  }

  // Placeholder for APCA (to be implemented later)
  const apcaContrast = calculateAPCAContrast(foregroundColor, backgroundColor);
  const apcaTextElement = document.getElementById('APCAtext');
  if (apcaTextElement) {
    apcaTextElement.textContent = `${apcaContrast}`;
  }
}

function updateUIColors() {
  document.documentElement.style.setProperty('--foreground', foregroundColor);
  document.documentElement.style.setProperty('--background', backgroundColor);

  (document.querySelector('#foregroundSelector input') as HTMLInputElement).value = foregroundColor;
  (document.querySelector('#backgroundSelector input') as HTMLInputElement).value = backgroundColor;
}

function updateSelectionMode(newMode: "none" | "foreground" | "background"): void {
  selectionMode = newMode;
  const foregroundEl = document.getElementById('foreground');
  const backgroundEl = document.getElementById('background');

  if (!foregroundEl || !backgroundEl) {
    console.error('Could not find foreground or background elements')
    return;
  }

  if ( selectionMode === 'foreground') {
    foregroundEl.classList.add("active");
    backgroundEl.classList.remove("active");
  } else if ( selectionMode === 'background'){
    backgroundEl.classList.add("active");
    foregroundEl.classList.remove("active");
  } else {
    foregroundEl.classList.remove("active");
    backgroundEl.classList.remove("active");
  }
}

function handlePluginMessage(event: MessageEvent): void {
  const message = event.data.pluginMessage;
  if (!message) return;

  switch (message.type) {
    case 'selectionChange':
      console.log('Selection changed:', message.selectionColor);
      updateColor(message.selectionColor, selectionMode === 'foreground' ? 'foreground' : 'background');
      break;

    default:
      console.log('Unknown message type', message.type);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('foreground', foregroundColor, 'background', backgroundColor, 'contrast', contrast, 'selection mode', selectionMode);
    updateColor(foregroundColor, 'foreground');
    updateColor(backgroundColor, 'background');

    // SELECTION MODE CHANGE INPUT ——————————————————————————————————————————————————————————————————————

    const foregroundEl = document.getElementById('foreground') as HTMLFormElement | null;
    const backgroundEl = document.getElementById('background') as HTMLFormElement | null;

    // Set up click handlers for selection mode
    if (foregroundEl && backgroundEl) {
    foregroundEl.addEventListener('click', () => updateSelectionMode('foreground'));
    backgroundEl.addEventListener('click', () => updateSelectionMode('background'));
  }
    updateSelectionMode("foreground");

    // USER HEX CODE INPUT ——————————————————————————————————————————————————————————————————————

    // Get both forms
    const foregroundSelector = document.getElementById('foregroundSelector') as HTMLFormElement | null;
    const backgroundSelector = document.getElementById('backgroundSelector') as HTMLFormElement | null;

    //foreground update
    if (foregroundSelector && backgroundSelector) {
      foregroundSelector.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = foregroundSelector.querySelector("input") as HTMLInputElement | null;
        if (input) {
          console.log("Form 1 submitted with value:", input.value);
          updateColor(input.value, 'foreground');
        }
      });

      backgroundSelector.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        const input = backgroundSelector.querySelector('input') as HTMLInputElement | null;
        if (input) {
          console.log('Form 2 submitted with value:', input);
          updateColor(input.value, 'background');
        }
      });
    }

    window.onmessage = handlePluginMessage;

    updateUIColors();
  });