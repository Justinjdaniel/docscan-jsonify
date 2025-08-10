import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { FiCamera, FiUpload } from 'react-icons/fi';
import React from 'react';

const OCRControls = ({ onFileSelect, onCameraSelect, onEngineChange, engine, processing }) => {
  const fileInputRef = React.useRef();

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl as="fieldset">
        <FormLabel as="legend">Choose OCR Engine</FormLabel>
        <RadioGroup onChange={onEngineChange} value={engine}>
          <Stack direction="row" spacing={4}>
            <Radio value="tesseract">Tesseract.js</Radio>
            <Radio value="scribe">ScribeOCR</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <HStack spacing={4}>
        <Button
          leftIcon={<FiUpload />}
          colorScheme="blue"
          onClick={handleFileButtonClick}
          isLoading={processing}
          loadingText="Processing..."
        >
          Upload Image
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          style={{ display: 'none' }}
          accept="image/*"
          data-testid="file-input"
        />
        <Button
          leftIcon={<FiCamera />}
          colorScheme="teal"
          onClick={onCameraSelect}
          isLoading={processing}
          loadingText="Processing..."
        >
          Use Camera
        </Button>
      </HStack>
    </VStack>
  );
};

export default OCRControls;
