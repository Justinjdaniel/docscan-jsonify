import { Tesseract } from './tesseract.js';

async function performOcr(imageCanvas, ocrResultEl) {
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
    workerPath: './ocr/tesseract/worker.min.js'
  });
  ocrResultEl.textContent = "OCR Complete. Raw text is in the JSON below.";
  return text;
}

export { performOcr };
