import {
  calculateWCAGContrast,
  calculatePerceptualContrast,
} from "./contrastCalculator";

let foregroundColor: string = "#000000";
let backgroundColor: string = "#FFFFFF";
let wcagContrast: number | null = null;
let perceptualContrast: number | null = null;
let selectionMode: "none" | "foreground" | "background" = "none";

function updateColor(color: string, type: "foreground" | "background"): void {
  if (type === "foreground") {
    foregroundColor = color;
  } else {
    backgroundColor = color;
  }
  calculateContrast();
  updateUIColors();
  updateContrastUI();
}

function swapColors(): void {
  const newForegroundColor: string = backgroundColor;
  const newBackgroundColor: string = foregroundColor;
  console.log(newForegroundColor, newBackgroundColor);
  updateColor(newForegroundColor, "foreground");
  updateColor(newBackgroundColor, "background");
}

function calculateContrast(): void {
  wcagContrast = calculateWCAGContrast(foregroundColor, backgroundColor);
  perceptualContrast = calculatePerceptualContrast(foregroundColor, backgroundColor);
}

function updateUIColors() {
  document.documentElement.style.setProperty("--foreground", foregroundColor);
  document.documentElement.style.setProperty("--background", backgroundColor);

  (
    document.querySelector("#foregroundSelector input") as HTMLInputElement
  ).value = foregroundColor;
  (
    document.querySelector("#backgroundSelector input") as HTMLInputElement
  ).value = backgroundColor;

  (document.querySelector("#foregroundHTMLPicker") as HTMLInputElement).value =
    foregroundColor;
  (document.querySelector("#backgroundHTMLPicker") as HTMLInputElement).value =
    backgroundColor;
}

function updateContrastUI() {
  figma.notify("updateContrastUI function called");
  const wcagTextElement = document.getElementById("WCAGtext");
  if (wcagTextElement) {
    wcagTextElement.textContent = `${wcagContrast}`;
  }

  //APCA calc
  const apcaTextElement = document.getElementById("APCAtext");
  if (apcaTextElement) {
    apcaTextElement.textContent = `${perceptualContrast}`;
  }

  console.log("test", perceptualContrast);

  console.log('apcaTextElement');

  // Perceptual card updates
  // const perceptualMinType = document.getElementById("perceptualMinType");
  const perceptualText = document.getElementById("perceptualText");
  console.log('perceptual text', perceptualText, perceptualContrast);

  if (perceptualText && perceptualContrast) {
    if (perceptualContrast < 15) {
      perceptualText.innerText ="absolute minimum for non-text that needs to be discernible";
    } else if (perceptualContrast >= 15 && perceptualContrast < 30) {

    } else if (perceptualContrast >= 30 && perceptualContrast < 45) {

    } else if (perceptualContrast >= 45 && perceptualContrast < 60) {

    } else if (perceptualContrast >= 60 && perceptualContrast < 75) { 

    } else {
      perceptualText.innerText ="absolute minimum for non-text that needs to be discernible";
    }
  }

  // WCAG card updates
  const elements = [
    { id: "checkExLargeAA", minContrast: 3 },
    { id: "checkExBodyAA", minContrast: 4.5 },
    { id: "checkBodyAA", minContrast: 4.5 },
    { id: "checkBodyAAA", minContrast: 7 },
    { id: "checkLargeAA", minContrast: 3 },
    { id: "checkLargeAAA", minContrast: 4.5 }
  ];

  elements.forEach(({ id, minContrast }) => {
    const element = document.getElementById(id);
    if (element && wcagContrast) {
      if (wcagContrast >= minContrast) {
        element.classList.add("meetsCriteria");
      } else {
        element.classList.remove("meetsCriteria");
      }
    }
  });

  // Update Perceptual Card
}

function updateSelectionMode(
  newMode: "none" | "foreground" | "background"
): void {
  selectionMode = newMode;
  const foregroundEl = document.getElementById("foreground");
  const backgroundEl = document.getElementById("background");

  if (!foregroundEl || !backgroundEl) {
    console.error("Could not find foreground or background elements");
    return;
  }

  if (selectionMode === "foreground") {
    foregroundEl.classList.add("active");
    backgroundEl.classList.remove("active");
  } else if (selectionMode === "background") {
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
    case "selectionChange":
      console.log("Selection changed:", message.selectionColor);
      updateColor(
        message.selectionColor,
        selectionMode === "foreground" ? "foreground" : "background"
      );
      break;

    default:
      console.log("Unknown message type", message.type);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "foreground",
    foregroundColor,
    "background",
    backgroundColor,
    "contrast",
    wcagContrast,
    "selection mode",
    selectionMode
  );

  // Initialize on load

  updateColor(foregroundColor, "foreground");
  updateColor(backgroundColor, "background");
  // Initialize UI display
  updateUIColors();

  // SELECTION MODE CHANGE INPUT ——————————————————————————————————————————————————————————————————————

  const foregroundEl = document.getElementById(
    "foreground"
  ) as HTMLFormElement | null;
  const backgroundEl = document.getElementById(
    "background"
  ) as HTMLFormElement | null;

  // Set up click handlers for selection mode
  if (foregroundEl && backgroundEl) {
    foregroundEl.addEventListener("click", () =>
      updateSelectionMode("foreground")
    );
    backgroundEl.addEventListener("click", () =>
      updateSelectionMode("background")
    );
  }

  updateSelectionMode("foreground");

  // USER HEX CODE INPUT ——————————————————————————————————————————————————————————————————————

  // Get both forms
  const foregroundSelector = document.getElementById(
    "foregroundSelector"
  ) as HTMLFormElement | null;
  const backgroundSelector = document.getElementById(
    "backgroundSelector"
  ) as HTMLFormElement | null;

  //foreground update
  if (foregroundSelector && backgroundSelector) {
    foregroundSelector.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = foregroundSelector.querySelector(
        "input"
      ) as HTMLInputElement | null;
      if (input) {
        // console.log("Form 1 submitted with value:", input.value);
        updateColor(input.value, "foreground");
      }
    });

    backgroundSelector.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      const input = backgroundSelector.querySelector(
        "input"
      ) as HTMLInputElement | null;
      if (input) {
        // console.log("Form 2 submitted with value:", input);
        updateColor(input.value, "background");
      }
    });
  }

  // USER COLOR PICKER INPUT ——————————————————————————————————————————————————————————————————

  //Get both forms
  const foregroundColorPicker = document.getElementById(
    "foregroundHTMLPicker"
  ) as HTMLFormElement | null;
  const backgroundColorPicker = document.getElementById(
    "backgroundHTMLPicker"
  ) as HTMLFormElement | null;

  //foreground update
  if (foregroundColorPicker && backgroundColorPicker) {
    foregroundColorPicker.addEventListener("input", (event) => {
      event.preventDefault();
      // console.log("Form 1 submitted with value:", foregroundColorPicker.value);
      updateColor(foregroundColorPicker.value, "foreground");
    });

    backgroundColorPicker.addEventListener("input", (event) => {
      event.preventDefault();
      // console.log("Form 2 submitted with value:", backgroundColorPicker.value);
      updateColor(backgroundColorPicker.value, "background");
    });
  }

  // USER SWAP BUTTON ——————————————————————————————————————————————————————————————————
  const swapColorButton = document.getElementById(
    "swapColors"
  ) as HTMLButtonElement | null;

  if (swapColorButton) {
    swapColorButton.addEventListener("click", swapColors);
  }

  // MESSAGE FROM PLUGIN JS LISTENING

  window.onmessage = handlePluginMessage;
});
