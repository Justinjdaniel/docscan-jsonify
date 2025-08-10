import { Box, Container, Heading, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import OCRControls from './components/OCRControls';
import ResultsDisplay from './components/ResultsDisplay';
import CameraModal from './components/CameraModal';
import { useOCR } from './hooks/useOCR';

// Utility to convert base64 data URI to a File object
function dataURIToFile(dataURI, filename) {
  const arr = dataURI.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function App() {
  const [engine, setEngine] = useState('tesseract');
  const [selectedFile, setSelectedFile] = useState(null);
  const { processImage, result, status, processing } = useOCR();
  const { isOpen: isCameraOpen, onOpen: onCameraOpen, onClose: onCameraClose } = useDisclosure();

  useEffect(() => {
    if (selectedFile) {
      processImage(selectedFile, engine);
    }
  }, [selectedFile, engine]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCapture = (imageSrc) => {
    const file = dataURIToFile(imageSrc, 'capture.jpg');
    setSelectedFile(file);
  };

  const handleEngineChange = (newEngine) => {
    setEngine(newEngine);
  };

  return (
    <>
      <Box bg="gray.50" minH="100vh" py={12}>
        <Container maxW="container.lg">
          <VStack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" color="gray.700">
              DocScan-JSONify
            </Heading>
            <Box w="100%" p={8} bg="white" borderRadius="md" boxShadow="md">
              <OCRControls
                onFileSelect={handleFileSelect}
                onCameraSelect={onCameraOpen}
                onEngineChange={handleEngineChange}
                engine={engine}
                processing={processing}
              />
            </Box>
            <Box w="100%" p={8} bg="white" borderRadius="md" boxShadow="md">
              <ResultsDisplay result={result} status={status} />
            </Box>
          </VStack>
        </Container>
      </Box>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={onCameraClose}
        onCapture={handleCapture}
      />
    </>
  );
}

export default App;
