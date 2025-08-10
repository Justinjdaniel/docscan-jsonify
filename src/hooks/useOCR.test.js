import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useOCR } from './useOCR';
import { parseOCRResult } from '../utils/parser';

// Mock the OCR libraries
vi.mock('tesseract.js', () => ({
  default: {
    recognize: vi.fn().mockResolvedValue({
      data: { text: 'Mocked Tesseract Text' },
    }),
  },
}));

vi.mock('scribe.js-ocr', () => ({
  default: {
    extractText: vi.fn().mockResolvedValue('Mocked ScribeOCR Text'),
  },
}));

// Mock the parser utility
vi.mock('../utils/parser', () => ({
  parseOCRResult: vi.fn((text) => ({
    invoiceNumber: 'parsed',
    rawText: text,
  })),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL which are used in the hook
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('useOCR hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useOCR());
    expect(result.current.status).toBe('Idle');
    expect(result.current.result).toBeNull();
    expect(result.current.processing).toBe(false);
  });

  it('should process image with Tesseract.js and return parsed result', async () => {
    const { result } = renderHook(() => useOCR());
    const mockImage = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.processImage(mockImage, 'tesseract');
    });

    expect(parseOCRResult).toHaveBeenCalledWith('Mocked Tesseract Text');
    expect(result.current.status).toBe('Processing Complete.');
    expect(result.current.result.invoiceNumber).toBe('parsed');
    expect(result.current.processing).toBe(false);
  });

  it('should process image with ScribeOCR and return parsed result', async () => {
    const { result } = renderHook(() => useOCR());
    const mockImage = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.processImage(mockImage, 'scribe');
    });

    expect(parseOCRResult).toHaveBeenCalledWith('Mocked ScribeOCR Text');
    expect(result.current.status).toBe('Processing Complete.');
    expect(result.current.result.invoiceNumber).toBe('parsed');
    expect(result.current.processing).toBe(false);
  });

  it('should handle errors during processing', async () => {
    const Tesseract = (await import('tesseract.js')).default;
    Tesseract.recognize.mockRejectedValueOnce(new Error('OCR Failed'));

    const { result } = renderHook(() => useOCR());
    const mockImage = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.processImage(mockImage, 'tesseract');
    });

    expect(result.current.status).toBe('Error: OCR Failed');
    expect(result.current.result).toBeNull();
    expect(result.current.processing).toBe(false);
  });
});
