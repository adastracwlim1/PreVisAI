const vectorsFile = {
  scene_id: "orbital_witness_scene_03_atrium_breach",
  units: "meters",
  frame_rate: 24,
  duration_seconds: 9,
  coordinate_system: {
    x: "screen left to right",
    y: "floor to ceiling",
    z: "camera depth"
  },
  source: {
    type: "storyboard_image",
    processing: [
      "panel boundary detection",
      "subject and prop segmentation",
      "camera mark extraction",
      "contour-to-vector conversion"
    ]
  },
  environment: {
    location: "Eos Crown glass atrium",
    lighting: ["blue service path", "gold orbital sunset", "red drone scan cone"],
    gravity_event: { start: 5.4, end: 6.8, intensity: 0.62 }
  },
  objects: [
    {
      id: "mara_voss",
      type: "human",
      description: "graphite repair suit, cracked amber visor",
      path: [
        { t: 0, position: [-4.8, 0, 2.4], rotation: [0, 18, 0] },
        { t: 2.2, position: [-2.2, 0, 1.6], rotation: [0, 34, 0] },
        { t: 4.8, position: [-1.4, 0, 0.8], rotation: [0, 82, 0] },
        { t: 6.7, position: [1.2, 1.1, -0.5], rotation: [8, 101, -12] },
        { t: 9.0, position: [3.6, 0.35, -1.8], rotation: [0, 126, 0] }
      ]
    },
    {
      id: "sentinel_unit_6",
      type: "security_drone",
      description: "matte white drone, red twin sensor slits, stabilizer ring",
      path: [
        { t: 0, position: [5.1, 5.4, 1.2], rotation: [0, -42, 0] },
        { t: 2.8, position: [3.7, 3.4, 0.6], rotation: [0, -78, 0] },
        { t: 5.6, position: [2.4, 2.1, 0.2], rotation: [0, -96, 0] },
        { t: 9.0, position: [1.8, 2.0, -0.3], rotation: [0, -112, 0] }
      ],
      emitted_volume: {
        id: "red_scan_cone",
        shape: "cone",
        radius_meters: 3.2,
        sweep_degrees: 54,
        active_time: [3.1, 7.4]
      }
    },
    {
      id: "climate_control_elevator_rail",
      type: "set_piece",
      position: [3.9, 0.4, -1.9],
      scale: [0.3, 2.8, 0.3]
    }
  ],
  camera: [
    {
      t: [0, 3.2],
      lens_mm: 28,
      position: [-5.8, 3.2, 5.6],
      target: [-1.7, 0.6, 0.9],
      movement: "locked wide mezzanine angle"
    },
    {
      t: [3.2, 6.0],
      lens_mm: 40,
      position: [-2.4, 1.1, 3.4],
      target: [0.4, 0.7, 0.1],
      movement_vectors: [
        { axis: "z", value_per_second: -0.48 },
        { axis: "y", value_per_second: -0.12 }
      ]
    },
    {
      t: [6.0, 9.0],
      lens_mm: 35,
      position: [0.2, 0.65, 2.0],
      target: [3.4, 0.5, -1.7],
      movement_vectors: [
        { axis: "x", value_per_second: 0.92 },
        { axis: "z", value_per_second: -0.74 },
        { axis: "roll", value_degrees: -7 }
      ]
    }
  ]
};

const promptFile = `Generate a cinematic 9-second sci-fi thriller video from this scene package.

Scene: Mara Voss crosses the Eos Crown orbital hotel atrium during orbital sunset. The room is a vast curved glass atrium overlooking Earth, with blue service lights on the floor, gold sunlight reflections, and polished glass surfaces that mirror movement.

Character: Mara Voss wears a graphite maintenance repair suit and a cracked amber helmet visor. She moves carefully at first, hides behind a sculpture column, then kicks into a low-gravity glide toward the climate-control elevator rail.

Threat: Sentinel Unit 6 is a matte white hovering security drone with twin red sensor slits and a stabilizer ring. It descends from an upper-right balcony and projects a red scan cone across the floor.

Camera: Begin with a locked wide mezzanine shot. At 3 seconds, move into a smooth low dolly push. At 6 seconds, add a slight clockwise roll as artificial gravity flickers and Mara glides through the scan gap. Tense, precise, no handheld shake.

Visual style: high-end cinematic previs, realistic materials, cool blue and warm gold contrast, crisp reflections, volumetric red scan light, 24 fps, 2.39:1 aspect ratio.`;

const storyboardPreview = document.querySelector("#storyboardPreview");
const storyboardFile = document.querySelector("#storyboardFile");
const analyzeButton = document.querySelector("#analyzeButton");
const generateButton = document.querySelector("#generateButton");
const outputGrid = document.querySelector("#outputGrid");
const vectorOutput = document.querySelector("#vectorOutput");
const promptOutput = document.querySelector("#promptOutput");
const progressBar = document.querySelector("#progressBar");
const statusPill = document.querySelector("#statusPill");

function setStatus(text) {
  statusPill.lastChild.textContent = ` ${text}`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function runAnalysis() {
  outputGrid.hidden = true;
  progressBar.style.width = "18%";
  setStatus("Detecting storyboard panels");
  generateButton.disabled = true;
  analyzeButton.disabled = true;

  window.setTimeout(() => {
    progressBar.style.width = "58%";
    setStatus("Extracting motion vectors");
  }, 450);

  window.setTimeout(() => {
    progressBar.style.width = "86%";
    setStatus("Composing video prompt");
  }, 950);

  window.setTimeout(() => {
    vectorOutput.textContent = JSON.stringify(vectorsFile, null, 2);
    promptOutput.textContent = promptFile;
    outputGrid.hidden = false;
    progressBar.style.width = "100%";
    setStatus("Video AI package ready");
    generateButton.disabled = false;
    analyzeButton.disabled = false;
  }, 1450);
}

storyboardFile.addEventListener("change", () => {
  const [file] = storyboardFile.files;

  if (!file) {
    return;
  }

  storyboardPreview.src = URL.createObjectURL(file);
  outputGrid.hidden = true;
  progressBar.style.width = "0%";
  setStatus(`${file.name} loaded`);
});

analyzeButton.addEventListener("click", runAnalysis);
generateButton.addEventListener("click", runAnalysis);

document.querySelectorAll(".download-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.file === "vectors") {
      downloadFile("scene_vectors.json", JSON.stringify(vectorsFile, null, 2), "application/json");
    } else {
      downloadFile("video_prompt.txt", promptFile, "text/plain");
    }
  });
});
