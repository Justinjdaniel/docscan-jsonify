import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useOCR } from './useOCR';

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

// Mock URL.createObjectURL and URL.revokeObjectURL which are used in the hook
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('useOCR hook', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useOCR());

    expect(result.current.status).toBe('Idle');
    expect(result.current.result).toBeNull();
    expect(result.current.processing).toBe(false);
  });

  it('should process image with Tesseract.js', async () => {
    const { result } = renderHook(() => useOCR());
    const mockImage = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.processImage(mockImage, 'tesseract');
    });

    expect(result.current.status).toBe('Tesseract.js OCR Complete.');
    expect(result.current.result).toEqual({ rawText: 'Mocked Tesseract Text' });
    expect(result.current.processing).toBe(false);
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockImage);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('should process image with ScribeOCR', async () => {
    const { result } = renderHook(() => useOCR());
    const mockImage = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.processImage(mockImage, 'scribe');
    });

    expect(result.current.status).toBe('ScribeOCR Complete.');
    expect(result.current.result).toEqual({ rawText: 'Mocked ScribeOCR Text' });
    expect(result.current.processing).toBe(false);
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockImage);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
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
