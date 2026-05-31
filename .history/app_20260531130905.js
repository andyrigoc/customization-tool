const state = {
  product: "polo",
  productName: "Polo",
  colourName: "White",
  colourHex: "#ffffff",
  sizes: [{ size: "Medium", qty: 1 }],
  totalQty: 1,
  selectedArea: "front",
  decorationType: null,
  textType: null,
  uploadedLogo: null,
  originalUploadedLogo: null,
  copyrightConfirmed: false,
  text: "",
  textColour: "#ff2b2b",
  font: "Arial",
  names: [],
  basePrice: 11.99,
  price: 11.99,
  logoRotation: 0,
  textRotation: 0,
  logoZIndex: 40
};

const screens = document.querySelectorAll(".screen");
const productPreview = document.getElementById("productPreview");
const customArea = document.getElementById("customArea");
const productShape = document.getElementById("productShape");
const colourGrid = document.getElementById("colourGrid");
const selectedColourName = document.getElementById("selectedColourName");
const productSelect = document.getElementById("productSelect");
const productPageTitle = document.getElementById("productPageTitle");
const sizesContainer = document.getElementById("sizesContainer");
const mainQtyInput = document.getElementById("mainQtyInput");
const mainPrice = document.getElementById("mainPrice");

const colourLayer = document.getElementById("colourLayer");
const designLayer = document.getElementById("designLayer");
const uploadedLogo = document.getElementById("uploadedLogo");
const logoSettingsBtn = document.getElementById("logoSettingsBtn");
const deleteLogoBtn = document.getElementById("deleteLogoBtn");
const logoSizeLabel = document.getElementById("logoSizeLabel");
const rotateHandle = document.getElementById("rotateHandle");

const textLayer = document.getElementById("textLayer");
const textContent = document.getElementById("textContent");
const textSettingsBtn = document.getElementById("textSettingsBtn");
const deleteTextBtn = document.getElementById("deleteTextBtn");
const textRotateHandle = document.getElementById("textRotateHandle");
const textSizeLabel = document.getElementById("textSizeLabel");

const removeBackgroundCheck = document.getElementById("removeBackgroundCheck");
const resizeProportionallyCheck = document.getElementById("resizeProportionallyCheck");
const applyImagePropertiesBtn = document.getElementById("applyImagePropertiesBtn");
const propertySizeLabel = document.getElementById("propertySizeLabel");
const rotateInput = document.getElementById("rotateInput");

const textPropertyInput = document.getElementById("textPropertyInput");
const textPropertyColour = document.getElementById("textPropertyColour");
const textResizeProportionallyCheck = document.getElementById("textResizeProportionallyCheck");
const textRotateInput = document.getElementById("textRotateInput");
const textPropertySizeLabel = document.getElementById("textPropertySizeLabel");

const colours = [
  ["White", "#ffffff"],
  ["Black", "#1d2327"],
  ["Navy", "#24153b"],
  ["Royal Blue", "#006b90"],
  ["Red", "#cc3428"],
  ["Burgundy", "#8f2140"],
  ["Grey", "#c8c8c8"],
  ["Green", "#087b32"],
  ["Orange", "#f8be1d"],
  ["Pink", "#e96aa3"],
  ["Purple", "#a64b93"],
  ["Cream", "#efd8a9"]
];

function openScreen(screenId) {
  screens.forEach(screen => screen.classList.remove("active-screen"));
  document.getElementById(screenId).classList.add("active-screen");
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => openScreen(button.dataset.open));
});

function updateVisibilityByPrintArea(layer) {
  const layerRect = layer.getBoundingClientRect();
  const areaRect = customArea.getBoundingClientRect();

  const isFullyInside =
    layerRect.left >= areaRect.left &&
    layerRect.right <= areaRect.right &&
    layerRect.top >= areaRect.top &&
    layerRect.bottom <= areaRect.bottom;

  const isCompletelyOutside =
    layerRect.right < areaRect.left ||
    layerRect.left > areaRect.right ||
    layerRect.bottom < areaRect.top ||
    layerRect.top > areaRect.bottom;

  layer.classList.remove("inside-print-area", "outside-print-area", "fully-outside-print-area");

  if (isFullyInside) {
    layer.classList.add("inside-print-area");
    return;
  }

  if (isCompletelyOutside) {
    layer.classList.add("fully-outside-print-area");
    return;
  }

  layer.classList.add("outside-print-area");
}

function renderColours() {
  colourGrid.innerHTML = "";

  colours.forEach(([name, hex]) => {
    const swatch = document.createElement("button");
    swatch.className = "colour-swatch";
    swatch.style.background = hex;
    swatch.title = name;

    if (name === state.colourName) swatch.classList.add("selected");

    swatch.addEventListener("click", () => {
      state.colourName = name;
      state.colourHex = hex;
      selectedColourName.textContent = name;
      colourLayer.style.backgroundColor = hex;

      document.querySelectorAll(".colour-swatch").forEach(item => item.classList.remove("selected"));
      swatch.classList.add("selected");
    });

    colourGrid.appendChild(swatch);
  });
}

function applyArea() {
  productPreview.className = "product-preview";
  productPreview.classList.add(`area-${state.selectedArea}`);

  setTimeout(() => {
    if (state.uploadedLogo) centerLogo();
    if (state.text) centerText();
  }, 0);
}

function collectSizes() {
  const rows = sizesContainer.querySelectorAll(".size-row");
  state.sizes = [];

  rows.forEach(row => {
    const size = row.querySelector(".size-select").value;
    const qty = parseInt(row.querySelector(".size-qty").value) || 1;
    state.sizes.push({ size, qty });
  });

  state.totalQty = state.sizes.reduce((sum, item) => sum + item.qty, 0);
  mainQtyInput.value = state.totalQty;
}

function calculatePrice() {
  const qty = parseInt(mainQtyInput.value) || state.totalQty || 1;
  let unit = state.basePrice;

  if (state.decorationType === "embroidery") unit += 4.5;
  if (state.decorationType === "dtf") unit += 3.95;
  if (state.decorationType === "screen") unit += 2.95;
  if (state.decorationType === "vinyl") unit += 3.5;
  if (state.text) unit += 1.5;
  if (state.names.length > 0) unit += 4;

  state.price = qty * unit;
  mainPrice.textContent = `£${state.price.toFixed(2)}`;
}

document.getElementById("changeProductBtn").addEventListener("click", () => {
  const changer = document.getElementById("productChanger");
  changer.style.display = changer.style.display === "none" ? "block" : "none";
});

productSelect.addEventListener("change", () => {
  state.product = productSelect.value;
  state.productName = productSelect.options[productSelect.selectedIndex].text;
  productPageTitle.textContent = `Custom ${state.productName}`;
});

document.getElementById("addSizeBtn").addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "size-row";
  row.innerHTML = `
    <select class="size-select">
      <option>XS</option>
      <option>Small</option>
      <option selected>Medium</option>
      <option>Large</option>
      <option>XL</option>
      <option>XXL</option>
      <option>3XL</option>
    </select>
    <input class="size-qty" type="number" min="1" value="1">
  `;
  sizesContainer.appendChild(row);
});

document.getElementById("applyProductBtn").addEventListener("click", () => {
  collectSizes();
  calculatePrice();
  renderMiniColours();
  openScreen("mainEditor");
});

mainQtyInput.addEventListener("input", () => {
  state.totalQty = parseInt(mainQtyInput.value) || 1;
  calculatePrice();
});

document.querySelectorAll("[data-text-type]").forEach(card => {
  card.addEventListener("click", () => {
    state.textType = card.dataset.textType;
    openScreen("textEditorPage");
  });
});

document.getElementById("applyTextBtn").addEventListener("click", () => {
  state.text = document.getElementById("customTextInput").value.trim() || "TEXT";
  state.textColour = document.getElementById("textColourInput").value;
  state.font = document.getElementById("fontSelect").value;

  showTextOnCanvas(state.text);

  calculatePrice();
  openScreen("mainEditor");
});

function showTextOnCanvas(value) {
  textContent.textContent = value;
  textContent.style.color = state.textColour;
  textContent.style.fontFamily = state.font;

  textLayer.style.display = "flex";
  textLayer.style.width = "190px";
  textLayer.style.height = "60px";
  textLayer.style.rotate = "0deg";
  textLayer.style.transform = "none";

  state.textRotation = 0;

  centerText();
  activateText();
  updateTextSizeLabels();
  updateVisibilityByPrintArea(textLayer);
}

function centerText() {
  textLayer.style.left = `${customArea.offsetWidth / 2 - textLayer.offsetWidth / 2}px`;
  textLayer.style.top = `${customArea.offsetHeight / 2 - textLayer.offsetHeight / 2}px`;
  updateVisibilityByPrintArea(textLayer);
}

function activateText() {
  if (!state.text) return;
  textLayer.classList.add("active-text");
  designLayer.classList.remove("active-logo");
  updateTextSizeLabels();
}

function updateTextSizeLabels() {
  const widthCm = (textLayer.offsetWidth / 10).toFixed(2);
  const heightCm = (textLayer.offsetHeight / 10).toFixed(2);
  const label = `${widthCm}cm x ${heightCm}cm`;

  textSizeLabel.textContent = label;
  textPropertySizeLabel.textContent = label;
}

textSettingsBtn.addEventListener("click", e => {
  e.stopPropagation();

  textPropertyInput.value = state.text || textContent.textContent;
  textPropertyColour.value = state.textColour;
  textRotateInput.value = Math.round(state.textRotation || 0);

  updateTextSizeLabels();
  openScreen("textPropertiesPage");
});

deleteTextBtn.addEventListener("click", e => {
  e.stopPropagation();

  state.text = "";
  textContent.textContent = "";
  textLayer.style.display = "none";
  textLayer.classList.remove("active-text");
  calculatePrice();
});

document.querySelectorAll("[data-design-type]").forEach(card => {
  card.addEventListener("click", () => {
    state.decorationType = card.dataset.designType;
    openScreen("logoUploadPage");
  });
});

document.getElementById("logoFileInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    state.uploadedLogo = e.target.result;
    state.originalUploadedLogo = e.target.result;
    document.getElementById("copyrightImagePreview").src = state.uploadedLogo;
  };

  reader.readAsDataURL(file);
});

document.getElementById("continueLogoBtn").addEventListener("click", () => {
  if (!state.uploadedLogo) {
    alert("Please upload a design first.");
    return;
  }

  openScreen("copyrightPage");
});

document.getElementById("copyrightOkBtn").addEventListener("click", () => {
  const checkbox = document.getElementById("copyrightCheckbox");

  if (!checkbox.checked) {
    alert("Please confirm you own the rights to print this image.");
    return;
  }

  state.copyrightConfirmed = true;

  showLogoOnCanvas(state.uploadedLogo);
  calculatePrice();
  openScreen("mainEditor");
});

function showLogoOnCanvas(imageSrc) {
  state.uploadedLogo = imageSrc;

  uploadedLogo.src = imageSrc;
  uploadedLogo.style.display = "block";

  designLayer.style.display = "flex";
  designLayer.style.width = "130px";
  designLayer.style.height = "130px";
  designLayer.style.rotate = "0deg";
  designLayer.style.transform = "none";

  state.logoRotation = 0;

  centerLogo();
  activateLogo();
  updateLogoSizeLabels();
  updateVisibilityByPrintArea(designLayer);
}

function centerLogo() {
  designLayer.style.left = `${customArea.offsetWidth / 2 - designLayer.offsetWidth / 2}px`;
  designLayer.style.top = `${customArea.offsetHeight / 2 - designLayer.offsetHeight / 2}px`;
  updateVisibilityByPrintArea(designLayer);
}

function activateLogo() {
  if (!state.uploadedLogo) return;
  designLayer.classList.add("active-logo");
  textLayer.classList.remove("active-text");
  updateLogoSizeLabels();
}

function updateLogoSizeLabels() {
  const widthCm = (designLayer.offsetWidth / 10).toFixed(2);
  const heightCm = (designLayer.offsetHeight / 10).toFixed(2);
  const label = `${widthCm}cm x ${heightCm}cm`;

  logoSizeLabel.textContent = label;
  propertySizeLabel.textContent = label;
}

logoSettingsBtn.addEventListener("click", e => {
  e.stopPropagation();
  updateLogoSizeLabels();
  rotateInput.value = Math.round(state.logoRotation || 0);
  openScreen("imagePropertiesPage");
});

deleteLogoBtn.addEventListener("click", e => {
  e.stopPropagation();
  clearLogo();
});

document.getElementById("deleteDesignShortcut").addEventListener("click", clearLogo);

function clearLogo() {
  uploadedLogo.src = "";
  uploadedLogo.style.display = "none";
  designLayer.style.display = "none";
  designLayer.classList.remove("active-logo");

  state.uploadedLogo = null;
  state.originalUploadedLogo = null;
  state.copyrightConfirmed = false;
  state.logoRotation = 0;

  calculatePrice();
}

let logoAction = null;
let logoStartX = 0;
let logoStartY = 0;
let logoStartLeft = 0;
let logoStartTop = 0;
let logoStartWidth = 0;
let logoStartHeight = 0;
let logoStartRotation = 0;
let logoStartAngle = 0;

let textAction = null;
let textStartX = 0;
let textStartY = 0;
let textStartLeft = 0;
let textStartTop = 0;
let textStartWidth = 0;
let textStartHeight = 0;
let textStartRotation = 0;
let textStartAngle = 0;

designLayer.addEventListener("pointerdown", e => {
  if (!state.uploadedLogo) return;

  if (
    e.target.classList.contains("resize-dot") ||
    e.target.id === "rotateHandle" ||
    e.target.tagName === "BUTTON"
  ) return;

  e.preventDefault();

  logoAction = "move";

  const rect = designLayer.getBoundingClientRect();
  const parentRect = customArea.getBoundingClientRect();

  logoStartX = e.clientX;
  logoStartY = e.clientY;
  logoStartLeft = rect.left - parentRect.left;
  logoStartTop = rect.top - parentRect.top;

  activateLogo();
  designLayer.setPointerCapture(e.pointerId);
});

document.querySelectorAll(".resize-dot").forEach(handle => {
  handle.addEventListener("pointerdown", e => {
    if (!state.uploadedLogo) return;

    e.preventDefault();
    e.stopPropagation();

    logoAction = handle.dataset.resize;

    const rect = designLayer.getBoundingClientRect();
    const parentRect = customArea.getBoundingClientRect();

    logoStartX = e.clientX;
    logoStartY = e.clientY;
    logoStartLeft = rect.left - parentRect.left;
    logoStartTop = rect.top - parentRect.top;
    logoStartWidth = designLayer.offsetWidth;
    logoStartHeight = designLayer.offsetHeight;

    activateLogo();
    handle.setPointerCapture(e.pointerId);
  });
});

rotateHandle.addEventListener("pointerdown", e => {
  if (!state.uploadedLogo) return;

  e.preventDefault();
  e.stopPropagation();

  logoAction = "rotate";

  const rect = designLayer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  logoStartAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  logoStartRotation = state.logoRotation || 0;

  activateLogo();
  rotateHandle.setPointerCapture(e.pointerId);
});

textLayer.addEventListener("pointerdown", e => {
  if (!state.text) return;

  if (
    e.target.classList.contains("text-resize-dot") ||
    e.target.id === "textRotateHandle" ||
    e.target.tagName === "BUTTON"
  ) return;

  e.preventDefault();

  textAction = "move";

  const rect = textLayer.getBoundingClientRect();
  const parentRect = customArea.getBoundingClientRect();

  textStartX = e.clientX;
  textStartY = e.clientY;
  textStartLeft = rect.left - parentRect.left;
  textStartTop = rect.top - parentRect.top;

  activateText();
  textLayer.setPointerCapture(e.pointerId);
});

document.querySelectorAll(".text-resize-dot").forEach(handle => {
  handle.addEventListener("pointerdown", e => {
    if (!state.text) return;

    e.preventDefault();
    e.stopPropagation();

    textAction = handle.dataset.textResize;

    const rect = textLayer.getBoundingClientRect();
    const parentRect = customArea.getBoundingClientRect();

    textStartX = e.clientX;
    textStartY = e.clientY;
    textStartLeft = rect.left - parentRect.left;
    textStartTop = rect.top - parentRect.top;
    textStartWidth = textLayer.offsetWidth;
    textStartHeight = textLayer.offsetHeight;

    activateText();
    handle.setPointerCapture(e.pointerId);
  });
});

textRotateHandle.addEventListener("pointerdown", e => {
  if (!state.text) return;

  e.preventDefault();
  e.stopPropagation();

  textAction = "rotate";

  const rect = textLayer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  textStartAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  textStartRotation = state.textRotation || 0;

  activateText();
  textRotateHandle.setPointerCapture(e.pointerId);
});

document.addEventListener("pointermove", e => {
  if (logoAction) handleObjectTransform(e, "logo");
  if (textAction) handleObjectTransform(e, "text");
});

document.addEventListener("pointerup", () => {
  logoAction = null;
  textAction = null;
});

function handleObjectTransform(e, type) {
  e.preventDefault();

  const isLogo = type === "logo";
  const layer = isLogo ? designLayer : textLayer;
  const action = isLogo ? logoAction : textAction;

  if (action === "move") {
    const dx = e.clientX - (isLogo ? logoStartX : textStartX);
    const dy = e.clientY - (isLogo ? logoStartY : textStartY);
    const startLeft = isLogo ? logoStartLeft : textStartLeft;
    const startTop = isLogo ? logoStartTop : textStartTop;

    layer.style.left = `${startLeft + dx}px`;
    layer.style.top = `${startTop + dy}px`;
    layer.style.transform = "none";

    isLogo ? updateLogoSizeLabels() : updateTextSizeLabels();
    updateVisibilityByPrintArea(layer);
    return;
  }

  if (action === "rotate") {
    const rect = layer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    if (isLogo) {
      const angleDiff = currentAngle - logoStartAngle;
      state.logoRotation = logoStartRotation + angleDiff * (180 / Math.PI);
      designLayer.style.rotate = `${state.logoRotation}deg`;
      rotateInput.value = Math.round(state.logoRotation);
      updateVisibilityByPrintArea(designLayer);
    } else {
      const angleDiff = currentAngle - textStartAngle;
      state.textRotation = textStartRotation + angleDiff * (180 / Math.PI);
      textLayer.style.rotate = `${state.textRotation}deg`;
      textRotateInput.value = Math.round(state.textRotation);
      updateVisibilityByPrintArea(textLayer);
    }

    return;
  }

  const startX = isLogo ? logoStartX : textStartX;
  const startY = isLogo ? logoStartY : textStartY;
  const startLeft = isLogo ? logoStartLeft : textStartLeft;
  const startTop = isLogo ? logoStartTop : textStartTop;
  const startWidth = isLogo ? logoStartWidth : textStartWidth;
  const startHeight = isLogo ? logoStartHeight : textStartHeight;
  const proportional = isLogo ? resizeProportionallyCheck.checked : textResizeProportionallyCheck.checked;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newLeft = startLeft;
  let newTop = startTop;
  let newWidth = startWidth;
  let newHeight = startHeight;

  if (action === "br") {
    newWidth = startWidth + dx;
    newHeight = proportional ? startHeight + dx * 0.35 : startHeight + dy;
  }

  if (action === "bl") {
    newWidth = startWidth - dx;
    newHeight = proportional ? startHeight - dx * 0.35 : startHeight + dy;
    newLeft = startLeft + dx;
  }

  if (action === "tr") {
    newWidth = startWidth + dx;
    newHeight = proportional ? startHeight + dx * 0.35 : startHeight - dy;
    newTop = startTop + dy;
  }

  if (action === "tl") {
    newWidth = startWidth - dx;
    newHeight = proportional ? startHeight - dx * 0.35 : startHeight - dy;
    newLeft = startLeft + dx;
    newTop = startTop + dy;
  }

  if (newWidth < 25) newWidth = 25;
  if (newHeight < 20) newHeight = 20;
  if (newWidth > 500) newWidth = 500;
  if (newHeight > 500) newHeight = 500;

  layer.style.left = `${newLeft}px`;
  layer.style.top = `${newTop}px`;
  layer.style.width = `${newWidth}px`;
  layer.style.height = `${newHeight}px`;
  layer.style.transform = "none";

  if (!isLogo) {
    textContent.style.fontSize = `${Math.max(12, newHeight * 0.78)}px`;
  }

  isLogo ? updateLogoSizeLabels() : updateTextSizeLabels();
  updateVisibilityByPrintArea(layer);
}

designLayer.addEventListener("click", e => {
  e.stopPropagation();
  activateLogo();
  updateVisibilityByPrintArea(designLayer);
});

textLayer.addEventListener("click", e => {
  e.stopPropagation();
  activateText();
  updateVisibilityByPrintArea(textLayer);
});

document.addEventListener("click", e => {
  if (!designLayer.contains(e.target)) designLayer.classList.remove("active-logo");
  if (!textLayer.contains(e.target)) textLayer.classList.remove("active-text");
});

function resizeLogoBy(amount) {
  let newWidth = designLayer.offsetWidth + amount;
  let newHeight = resizeProportionallyCheck.checked ? newWidth : designLayer.offsetHeight + amount;

  if (newWidth < 25) newWidth = 25;
  if (newHeight < 25) newHeight = 25;

  designLayer.style.width = `${newWidth}px`;
  designLayer.style.height = `${newHeight}px`;

  activateLogo();
  updateLogoSizeLabels();
  updateVisibilityByPrintArea(designLayer);
}

function resizeTextBy(amount) {
  let newWidth = textLayer.offsetWidth + amount;
  let newHeight = textLayer.offsetHeight + amount * 0.35;

  if (newWidth < 40) newWidth = 40;
  if (newHeight < 24) newHeight = 24;

  textLayer.style.width = `${newWidth}px`;
  textLayer.style.height = `${newHeight}px`;
  textContent.style.fontSize = `${Math.max(12, newHeight * 0.78)}px`;

  activateText();
  updateTextSizeLabels();
  updateVisibilityByPrintArea(textLayer);
}

document.getElementById("resizeLargeBtn").addEventListener("click", () => {
  if (designLayer.classList.contains("active-logo")) resizeLogoBy(10);
  if (textLayer.classList.contains("active-text")) resizeTextBy(10);
});

document.getElementById("resizeSmallBtn").addEventListener("click", () => {
  if (designLayer.classList.contains("active-logo")) resizeLogoBy(-10);
  if (textLayer.classList.contains("active-text")) resizeTextBy(-10);
});

rotateInput.addEventListener("input", () => {
  state.logoRotation = parseFloat(rotateInput.value) || 0;
  designLayer.style.rotate = `${state.logoRotation}deg`;
  activateLogo();
  updateVisibilityByPrintArea(designLayer);
});

applyImagePropertiesBtn.addEventListener("click", async () => {
  if (!state.uploadedLogo) {
    openScreen("mainEditor");
    return;
  }

  if (removeBackgroundCheck.checked) {
    const oldLeft = designLayer.style.left;
    const oldTop = designLayer.style.top;
    const oldWidth = designLayer.style.width;
    const oldHeight = designLayer.style.height;
    const oldRotate = designLayer.style.rotate;

    const cleanedLogo = await removeImageBackground(state.uploadedLogo, 55);

    state.uploadedLogo = cleanedLogo;
    uploadedLogo.src = cleanedLogo;
    uploadedLogo.style.display = "block";

    designLayer.style.display = "flex";
    designLayer.style.left = oldLeft;
    designLayer.style.top = oldTop;
    designLayer.style.width = oldWidth;
    designLayer.style.height = oldHeight;
    designLayer.style.rotate = oldRotate;
    designLayer.style.transform = "none";
  }

  updateLogoSizeLabels();
  activateLogo();
  updateVisibilityByPrintArea(designLayer);
  openScreen("mainEditor");
});

async function removeImageBackground(imageSrc, tolerance = 45) {
  return new Promise(resolve => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const bg = getCornerAverageColour(data, canvas.width, canvas.height);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distance = Math.sqrt(
          Math.pow(r - bg.r, 2) +
          Math.pow(g - bg.g, 2) +
          Math.pow(b - bg.b, 2)
        );

        const isNearWhite = r > 235 && g > 235 && b > 235;
        const isNearBlack = r < 25 && g < 25 && b < 25;

        if (distance < tolerance || isNearWhite || isNearBlack) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.src = imageSrc;
  });
}

function getCornerAverageColour(data, width, height) {
  const samples = [
    getPixel(data, 0, 0, width),
    getPixel(data, width - 1, 0, width),
    getPixel(data, 0, height - 1, width),
    getPixel(data, width - 1, height - 1, width)
  ];

  return {
    r: Math.round(samples.reduce((sum, p) => sum + p.r, 0) / samples.length),
    g: Math.round(samples.reduce((sum, p) => sum + p.g, 0) / samples.length),
    b: Math.round(samples.reduce((sum, p) => sum + p.b, 0) / samples.length)
  };
}

function getPixel(data, x, y, width) {
  const index = (y * width + x) * 4;

  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2]
  };
}

document.querySelectorAll("[data-move]").forEach(button => {
  button.addEventListener("click", () => {
    const move = button.dataset.move;
    const step = 10;

    let left = designLayer.offsetLeft;
    let top = designLayer.offsetTop;

    if (move.includes("left")) left -= step;
    if (move.includes("right")) left += step;
    if (move.includes("up")) top -= step;
    if (move.includes("down")) top += step;

    if (move === "center") {
      left = customArea.offsetWidth / 2 - designLayer.offsetWidth / 2;
      top = customArea.offsetHeight / 2 - designLayer.offsetHeight / 2;
    }

    designLayer.style.left = `${left}px`;
    designLayer.style.top = `${top}px`;
    designLayer.style.transform = "none";

    activateLogo();
    updateLogoSizeLabels();
    updateVisibilityByPrintArea(designLayer);
  });
});

document.getElementById("sizeUpBtn").addEventListener("click", () => resizeLogoBy(10));
document.getElementById("sizeDownBtn").addEventListener("click", () => resizeLogoBy(-10));

document.getElementById("applyTextPropertiesBtn").addEventListener("click", () => {
  state.text = textPropertyInput.value.trim() || "TEXT";
  state.textColour = textPropertyColour.value;

  textContent.textContent = state.text;
  textContent.style.color = state.textColour;

  state.textRotation = parseFloat(textRotateInput.value) || 0;
  textLayer.style.rotate = `${state.textRotation}deg`;

  activateText();
  updateTextSizeLabels();
  updateVisibilityByPrintArea(textLayer);
  openScreen("mainEditor");
});

textPropertyInput.addEventListener("input", () => {
  state.text = textPropertyInput.value;
  textContent.textContent = state.text;
});

textPropertyColour.addEventListener("input", () => {
  state.textColour = textPropertyColour.value;
  textContent.style.color = state.textColour;
});

textRotateInput.addEventListener("input", () => {
  state.textRotation = parseFloat(textRotateInput.value) || 0;
  textLayer.style.rotate = `${state.textRotation}deg`;
  updateVisibilityByPrintArea(textLayer);
});

document.getElementById("boldTextBtn").addEventListener("click", () => {
  textContent.style.fontWeight = textContent.style.fontWeight === "800" ? "400" : "800";
});

document.getElementById("italicTextBtn").addEventListener("click", () => {
  textContent.style.fontStyle = textContent.style.fontStyle === "italic" ? "normal" : "italic";
});

document.getElementById("alignLeftBtn").addEventListener("click", () => {
  textContent.style.textAlign = "left";
});

document.getElementById("alignCenterBtn").addEventListener("click", () => {
  textContent.style.textAlign = "center";
});

document.getElementById("alignRightBtn").addEventListener("click", () => {
  textContent.style.textAlign = "right";
});

document.getElementById("outlineRange").addEventListener("input", function () {
  const size = parseInt(this.value) || 0;
  const colour = document.getElementById("outlineColour").value;
  textContent.style.webkitTextStroke = `${size}px ${colour}`;
});

document.getElementById("outlineColour").addEventListener("input", function () {
  const size = parseInt(document.getElementById("outlineRange").value) || 0;
  textContent.style.webkitTextStroke = `${size}px ${this.value}`;
});

document.getElementById("openTextPositionSize").addEventListener("click", () => {
  document.getElementById("textPositionSizePanel").classList.toggle("open");
});

document.getElementById("fontSelectorBtn").addEventListener("click", () => {
  openScreen("fontPage");
});

document.querySelectorAll("[data-font]").forEach(button => {
  button.addEventListener("click", () => {
    const font = button.dataset.font;

    state.font = font;
    textContent.style.fontFamily = font;
    document.getElementById("fontSelectorBtn").textContent = font;

    openScreen("textPropertiesPage");
  });
});

document.querySelectorAll("[data-text-move]").forEach(button => {
  button.addEventListener("click", () => {
    const move = button.dataset.textMove;
    const step = 10;

    let left = textLayer.offsetLeft;
    let top = textLayer.offsetTop;

    if (move.includes("left")) left -= step;
    if (move.includes("right")) left += step;
    if (move.includes("up")) top -= step;
    if (move.includes("down")) top += step;

    if (move === "center") {
      left = customArea.offsetWidth / 2 - textLayer.offsetWidth / 2;
      top = customArea.offsetHeight / 2 - textLayer.offsetHeight / 2;
    }

    textLayer.style.left = `${left}px`;
    textLayer.style.top = `${top}px`;
    textLayer.style.transform = "none";

    activateText();
    updateTextSizeLabels();
    updateVisibilityByPrintArea(textLayer);
  });
});

document.getElementById("textSizeUpBtn").addEventListener("click", () => resizeTextBy(10));
document.getElementById("textSizeDownBtn").addEventListener("click", () => resizeTextBy(-10));

document.getElementById("addNameBtn").addEventListener("click", () => {
  const size = document.getElementById("namesSizeSelect").value;
  const qty = parseInt(document.getElementById("namesQtyInput").value) || 1;
  const name = document.getElementById("teamNameInput").value.trim();
  const number = document.getElementById("teamNumberInput").value.trim();

  if (!name && !number) {
    alert("Add a name or number.");
    return;
  }

  state.names.push({ size, qty, name, number });
  renderNames();

  document.getElementById("teamNameInput").value = "";
  document.getElementById("teamNumberInput").value = "";
});

function renderNames() {
  const list = document.getElementById("namesList");
  list.innerHTML = "";

  state.names.forEach(item => {
    const row = document.createElement("div");
    row.className = "names-item";
    row.innerHTML = `
      <div>${item.name || "-"} ${item.number ? "#" + item.number : ""}</div>
      <div>${item.size}</div>
      <div>x${item.qty}</div>
    `;
    list.appendChild(row);
  });
}

document.getElementById("namesNextBtn").addEventListener("click", () => {
  calculatePrice();
  openScreen("mainEditor");
});

document.querySelectorAll(".location-item").forEach(item => {
  item.addEventListener("click", () => {
    state.selectedArea = item.dataset.area;
    applyArea();
    openScreen("mainEditor");
  });
});

document.getElementById("colourShortcut").addEventListener("click", () => openScreen("productPage"));
document.getElementById("closeCustomiserBtn").addEventListener("click", () => alert("Customiser closed."));
document.getElementById("previewBtn").addEventListener("click", () => alert("Preview mode can be connected later."));
document.getElementById("basketBtn").addEventListener("click", () => document.getElementById("buyBtn").click());

document.getElementById("priceBtn").addEventListener("click", () => {
  calculatePrice();
  alert(`Estimated total: £${state.price.toFixed(2)}`);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  alert("Download proof function can be added with html2canvas.");
});

document.getElementById("shareBtn").addEventListener("click", () => {
  alert("Share function can be added later.");
});

document.getElementById("buyBtn").addEventListener("click", () => {
  collectSizes();

  const sizeBreakdown = state.sizes.map(item => `${item.size} x ${item.qty}`).join(", ");

  const namesBreakdown = state.names.length
    ? state.names.map(item => `${item.size} x${item.qty} - ${item.name || ""} ${item.number || ""}`).join("\n")
    : "No names / numbers";

  const body = `
Custom Product Request

Product: ${state.productName}
Colour: ${state.colourName}
Sizes: ${sizeBreakdown}
Total Quantity: ${state.totalQty}
Decoration Type: ${state.decorationType || "Not selected"}
Area: ${state.selectedArea}
Text Type: ${state.textType || "Not selected"}
Text: ${state.text || "No text"}
Names / Numbers:
${namesBreakdown}

Copyright Confirmed: ${state.copyrightConfirmed ? "Yes" : "No"}
Estimated Total: £${state.price.toFixed(2)}
  `.trim();

  const subject = encodeURIComponent("Custom Product Quote Request");
  const mailBody = encodeURIComponent(body);

  window.location.href = `mailto:quotes@brandeduk.com?subject=${subject}&body=${mailBody}`;
});

// Keep the bottom-sheet product select in sync with the product page select
const mainProductSelect = document.getElementById("mainProductSelect");
if (mainProductSelect) {
  mainProductSelect.addEventListener("change", () => {
    productSelect.value = mainProductSelect.value;
    productSelect.dispatchEvent(new Event("change"));
  });
}

renderColours();
applyArea();
calculatePrice();

/* =====================================================
   REDESIGNED MAIN EDITOR — new interactions
   ===================================================== */

// Mini colour row (4 swatches + plus)
function renderMiniColours() {
  const row = document.getElementById("miniColourRow");
  const dropdown = document.getElementById("colourDropdown");
  if (!row) return;
  row.innerHTML = "";
  if (dropdown) dropdown.innerHTML = "";

  // Helper: select a colour and update all state/UI
  function selectColour(name, hex) {
    state.colourName = name;
    state.colourHex = hex;
    colourLayer.style.backgroundColor = hex;
    if (typeof selectedColourName !== "undefined") selectedColourName.textContent = name;
    document.querySelectorAll(".mini-swatch").forEach(s => s.classList.remove("selected"));
    document.querySelectorAll(".mini-swatch").forEach(s => {
      if (s.title === name) s.classList.add("selected");
    });
    document.querySelectorAll(".colour-swatch").forEach(s => {
      s.classList.toggle("selected", s.title === name);
    });
  }

  // First 4 swatches in the row
  colours.slice(0, 4).forEach(([name, hex]) => {
    const btn = document.createElement("button");
    btn.className = "mini-swatch" + (name === state.colourName ? " selected" : "");
    btn.style.background = hex;
    btn.title = name;
    btn.addEventListener("click", () => selectColour(name, hex));
    row.appendChild(btn);
  });

  // "+" toggle button
  const plus = document.createElement("button");
  plus.className = "mini-swatch-plus";
  plus.textContent = "+";
  plus.title = "More colours";
  plus.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown) dropdown.classList.toggle("open");
  });
  row.appendChild(plus);

  // All colours in the dropdown
  if (dropdown) {
    colours.forEach(([name, hex]) => {
      const btn = document.createElement("button");
      btn.className = "mini-swatch" + (name === state.colourName ? " selected" : "");
      btn.style.background = hex;
      btn.title = name;
      btn.addEventListener("click", () => selectColour(name, hex));
      dropdown.appendChild(btn);
    });
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("colourDropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

renderMiniColours();

// View tabs (Front / Back / Left / Right)
document.querySelectorAll(".view-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-tab").forEach(b => b.classList.remove("active-view"));
    btn.classList.add("active-view");
    state.selectedArea = btn.dataset.area;
    applyArea();
  });
});

// QTY +/- buttons
const qtyDisplay = document.getElementById("qtyDisplay");

document.getElementById("qtyMinusBtn").addEventListener("click", () => {
  const v = Math.max(1, (parseInt(mainQtyInput.value) || 1) - 1);
  mainQtyInput.value = v;
  if (qtyDisplay) qtyDisplay.textContent = v;
  mainQtyInput.dispatchEvent(new Event("input"));
});

document.getElementById("qtyPlusBtn").addEventListener("click", () => {
  const v = (parseInt(mainQtyInput.value) || 1) + 1;
  mainQtyInput.value = v;
  if (qtyDisplay) qtyDisplay.textContent = v;
  mainQtyInput.dispatchEvent(new Event("input"));
});

// Keep qty display in sync when collectSizes() updates mainQtyInput
mainQtyInput.addEventListener("input", () => {
  if (qtyDisplay) qtyDisplay.textContent = mainQtyInput.value;
});

