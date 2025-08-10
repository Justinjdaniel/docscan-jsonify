import scribe from '../../node_modules/scribe.js-ocr/scribe.js';

async function performOcr(imageCanvas, ocrResultEl) {
  ocrResultEl.textContent = "Performing OCR with Scribe.js...";
  try {
    await scribe.init({ ocr: true });
    const dataUrl = imageCanvas.toDataURL('image/png');
    const result = await scribe.extractText([dataUrl]);
    ocrResultEl.textContent = "OCR Complete. Raw text is in the JSON below.";
    return result.text;
  } catch (error) {
    console.error('Error during Scribe.js OCR:', error);
    ocrResultEl.textContent = 'Error performing OCR with Scribe.js.';
    return '';
  } finally {
    await scribe.terminate();
  }
}

export { performOcr };
