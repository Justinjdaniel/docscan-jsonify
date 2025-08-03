document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const scannerContainer = document.getElementById("scanner-container");
  const startScanButton = document.getElementById("start-scan");
  const captureButton = document.getElementById("capture");
  const resultsDiv = document.getElementById("results");
  const ocrResultEl = document.getElementById("ocr-result");
  const jsonOutputEl = document.getElementById("json-output");
  const copyJsonButton = document.getElementById("copy-json");
  const downloadJsonButton = document.getElementById("download-json");

  let stream;
  let scanner;

  // --- Initialization ---
  function onOpenCvReady() {
    console.log("OpenCV initialized");
    scanner = new jscanify();
    startScanButton.disabled = false;
    startScanButton.textContent = "Start Camera";
  }

  const cvReadyInterval = setInterval(() => {
    if (window.cv) {
      clearInterval(cvReadyInterval);
      cv.onRuntimeInitialized = onOpenCvReady;
    }
  }, 200);

  // --- Event Listeners ---
  startScanButton.addEventListener("click", startCamera);
  captureButton.addEventListener("click", captureAndProcess);
  copyJsonButton.addEventListener("click", copyJsonToClipboard);
  downloadJsonButton.addEventListener("click", downloadJsonFile);
  document.getElementById("file-input").addEventListener("change", handleFileSelect);

  // --- Core Functions ---
  async function startCamera() {
    if (!scanner) {
      alert("Scanner not ready. Please wait for OpenCV to load.");
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
      await video.play();

      startScanButton.style.display = "none";
      captureButton.disabled = false;
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert(
        "Could not access the camera. Please ensure you have a camera connected and have granted permission."
      );
    }
  }

  function captureAndProcess() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.style.display = "none";
    canvas.style.display = "block";

    stream.getTracks().forEach((track) => track.stop());
    captureButton.disabled = true;

    if (scanner) {
      const resultCanvas = scanner.extractPaper(
        canvas,
        canvas.width,
        canvas.height
      );
      scannerContainer.innerHTML = "";
      scannerContainer.appendChild(resultCanvas);
      resultsDiv.style.display = "block";
      performOcr(resultCanvas);
    } else {
      console.error("jscanify is not initialized.");
      alert("Error: jscanify is not initialized.");
    }
  }

  async function performOcr(imageCanvas) {
    ocrResultEl.textContent = "Performing OCR...";
    const {
      data: { text },
    } = await Tesseract.recognize(imageCanvas, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          ocrResultEl.textContent = `Recognizing text... ${Math.round(
            m.progress * 100
          )}%`;
        }
      },
    });
    ocrResultEl.textContent = "OCR Complete. Raw text is in the JSON below.";
    parseTextAndGenerateJson(text);
  }

  function parseTextAndGenerateJson(text) {
    const lines = text.split('\n');
    const extractedData = {
      vendor: lines.length > 0 ? lines[0] : null,
      date: null,
      total: null,
      rawText: text,
    };

    // Very basic regex for date and total, to be improved
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
    const totalRegex = /(?:total|amount)[\s:]*([\$]?\d+\.\d{2})/i;

    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      extractedData.date = dateMatch[1];
    }

    const totalMatch = text.match(totalRegex);
    if (totalMatch) {
      extractedData.total = parseFloat(totalMatch[1].replace('$', ''));
    }

    jsonOutputEl.value = JSON.stringify(extractedData, null, 2);
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        video.style.display = "none";
        canvas.style.display = "block";

        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        captureButton.disabled = true;
        startScanButton.style.display = "none";

        if (scanner) {
          const resultCanvas = scanner.extractPaper(
            canvas,
            canvas.width,
            canvas.height
          );
          scannerContainer.innerHTML = "";
          scannerContainer.appendChild(resultCanvas);
          resultsDiv.style.display = "block";
          performOcr(resultCanvas);
        } else {
          console.error("jscanify is not initialized.");
          alert("Error: jscanify is not initialized.");
        }
      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  // --- UI/Export Functions ---
  function copyJsonToClipboard() {
    jsonOutputEl.select();
    navigator.clipboard
      .writeText(jsonOutputEl.value)
      .then(() => {
        copyJsonButton.textContent = "Copied!";
        setTimeout(() => {
          copyJsonButton.textContent = "Copy JSON";
        }, 2000);
      })
      .catch((err) => console.error("Failed to copy JSON: ", err));
  }

  function downloadJsonFile() {
    const jsonString = jsonOutputEl.value;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan-result.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Initial State ---
  startScanButton.disabled = true;
  startScanButton.textContent = "Loading Scanner...";
});
