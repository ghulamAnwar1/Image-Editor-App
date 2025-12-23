let filters = {
  brightness: { value: 100, min: 0, max: 200, unit: "%" },
  contrast: { value: 100, min: 0, max: 200, unit: "%" },
  exposure: { value: 100, min: 0, max: 200, unit: "%" },
  saturation: { value: 100, min: 0, max: 200, unit: "%" },
  hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
  blur: { value: 0, min: 0, max: 20, unit: "px" },
  grayscale: { value: 0, min: 0, max: 100, unit: "%" },
  sepia: { value: 0, min: 0, max: 100, unit: "%" },
  opacity: { value: 100, min: 0, max: 100, unit: "%" },
  invert: { value: 0, min: 0, max: 100, unit: "%" },
};

const image_canvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = image_canvas.getContext("2d");
const filters_container = document.querySelector(".filters");
const resetButton = document.querySelector("#reset-btn");
const download_button = document.querySelector("#download-btn");
const presetsContainer = document.querySelector(".presets");
let file = null;
let image = null;

function create_filter_element(name, unit, value, min, max) {
  const div = document.createElement("div");
  div.classList.add("filter");

  const p = document.createElement("p");
  p.innerText = name;

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = value;
  input.id = name;

  input.addEventListener("input", () => {
    filters[name].value = input.value;
    apply_filters();
  });

  div.appendChild(p);
  div.appendChild(input);

  return div;
}

function create_filters() {
  Object.keys(filters).forEach((key) => {
    const filterElement = create_filter_element(
      key,
      filters[key].unit,
      filters[key].value,
      filters[key].min,
      filters[key].max
    );
    filters_container.appendChild(filterElement);
  });
}

create_filters();
imgInput.addEventListener("change", (event) => {
  file = event.target.files[0];

  const ImagePlaceholder = document.querySelector(".placeholder");
  if (ImagePlaceholder) ImagePlaceholder.style.display = "none";

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    image = img;
    image_canvas.width = img.width;
    image_canvas.height = img.height;
    image_canvas.style.display = "block";
    apply_filters();
  };
});

function apply_filters() {
  if (!image) return;

  canvasCtx.filter =
    `brightness(${filters.brightness.value}%) ` +
    `contrast(${filters.contrast.value}%) ` +
    `saturate(${filters.saturation.value}%) ` +
    `hue-rotate(${filters.hueRotation.value}deg) ` +
    `blur(${filters.blur.value}px) ` +
    `grayscale(${filters.grayscale.value}%) ` +
    `sepia(${filters.sepia.value}%) ` +
    `invert(${filters.invert.value}%) ` +
    `opacity(${filters.opacity.value}%)`;

  canvasCtx.clearRect(0, 0, image_canvas.width, image_canvas.height);
  canvasCtx.drawImage(image, 0, 0);
}

resetButton.addEventListener("click", () => {
  filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    exposure: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" },
  };

  apply_filters();

  filters_container.innerHTML = "";
  create_filters();
});

download_button.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = image_canvas.toDataURL();
  link.click();
});

const presets = {
  drama: {
    brightness: 90,
    contrast: 150,
    exposure: 110,
    saturation: 80,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },
  vintage: {
    brightness: 110,
    contrast: 120,
    exposure: 100,
    saturation: 70,
    hueRotation: 10,
    blur: 0,
    grayscale: 0,
    sepia: 30,
    opacity: 100,
    invert: 0,
  },
  oldSchool: {
    brightness: 100,
    contrast: 100,
    exposure: 95,
    saturation: 50,
    hueRotation: 0,
    blur: 2,
    grayscale: 20,
    sepia: 40,
    opacity: 100,
    invert: 0,
  },
  cinematic: {
    brightness: 85,
    contrast: 140,
    exposure: 105,
    saturation: 90,
    hueRotation: 5,
    blur: 0,
    grayscale: 0,
    sepia: 10,
    opacity: 100,
    invert: 0,
  },
  blackWhite: {
    brightness: 100,
    contrast: 130,
    exposure: 100,
    saturation: 0,
    hueRotation: 0,
    blur: 0,
    grayscale: 100,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },
  softGlow: {
    brightness: 120,
    contrast: 110,
    exposure: 100,
    saturation: 120,
    hueRotation: 0,
    blur: 2,
    grayscale: 0,
    sepia: 10,
    opacity: 100,
    invert: 0,
  },
};

Object.keys(presets).forEach((presetName) => {
  const presetButton = document.createElement("button");
  presetButton.classList.add("btn");
  presetButton.innerHTML = presetName;
  presetsContainer.appendChild(presetButton);

  presetButton.addEventListener("click", () => {
    const preset = presets[presetName];

    Object.keys(preset).forEach((filterName) => {
      filters[filterName].value = preset[filterName];
    });

    apply_filters();
    filters_container.innerHTML = "";
    create_filters();
  });
});
