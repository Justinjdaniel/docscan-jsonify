import { useState } from 'react';
import Tesseract from 'tesseract.js';
import Scribe from 'scribe.js-ocr';

export const useOCR = () => {
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const processImage = async (image, engine) => {
    setProcessing(true);
    setResult(null);
    setStatus(`Initializing ${engine}...`);

    try {
      const imageUrl = URL.createObjectURL(image);

      if (engine === 'tesseract') {
        setStatus('Recognizing text with Tesseract.js...');
        const {
          data: { text },
        } = await Tesseract.recognize(imageUrl, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setStatus(`Recognizing... ${Math.round(m.progress * 100)}%`);
            }
          },
        });
        setResult({ rawText: text });
        setStatus('Tesseract.js OCR Complete.');
      } else if (engine === 'scribe') {
        setStatus('Recognizing text with ScribeOCR...');
        const scribeResult = await Scribe.extractText([imageUrl]);
        setResult({ rawText: scribeResult });
        setStatus('ScribeOCR Complete.');
      }

      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('OCR Error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return { processImage, result, status, processing };
};
