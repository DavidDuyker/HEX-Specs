function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getFill(nodes) {
  const nodesWithFills = nodes.filter(
    (node) =>
      "fills" in node &&
      node.fills &&
      node.fills.length > 0 &&
      node.fills[0].type === "SOLID"
  );

  if (nodesWithFills.length <= 0) {
    figma.notify("Please select a layer with a solid fill", {
      timeout: 1000,
    });
    return undefined;
  }

  return nodesWithFills.map((node) => (node as GeometryMixin).fills![0]);
}

figma.on("selectionchange", () => {
  const fills = getFill(figma.currentPage.selection);
  console.log("selectionchange", fills);
  if (fills && fills[0] && "color" in fills[0]) {
    const { r, g, b } = fills[0].color;
    const selectionColor = rgbToHex(r, g, b);
    console.log(selectionColor);

    figma.ui.postMessage({
      type: "selectionChange",
      selectionColor: selectionColor,
    });
  }
});

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 240, height: 216, themeColors: true });
