import { useState } from "react";
import Tesseract from "tesseract.js";
import Scribe from "scribe.js-ocr";
import { parseOCRResult } from "../utils/parser";

export const useOCR = () => {
  const [status, setStatus] = useState("Idle");
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const processImage = async (image, engine) => {
    setProcessing(true);
    setResult(null);
    setStatus(`Initializing ${engine}...`);

    let imageUrl;
    try {
      imageUrl = URL.createObjectURL(image);
      let rawText = "";

      if (engine === "tesseract") {
        setStatus("Recognizing text with Tesseract.js...");
        const {
          data: { text },
        } = await Tesseract.recognize(imageUrl, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setStatus(`Recognizing... ${Math.round(m.progress * 100)}%`);
            }
          },
        });
        rawText = text;
        setStatus("Tesseract.js OCR Complete. Parsing...");
      } else if (engine === "scribe") {
        setStatus("Recognizing text with ScribeOCR...");
        rawText = await Scribe.extractText([imageUrl]);
        setStatus("ScribeOCR Complete. Parsing...");
      }

      const parsedData = parseOCRResult(rawText);
      setResult(parsedData);
      setStatus("Processing Complete.");
    } catch (error) {
      console.error("OCR Error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setProcessing(false);
    }
  };

  return { processImage, result, status, processing, setStatus, setProcessing };
};
