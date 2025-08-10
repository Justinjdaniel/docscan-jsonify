import { Box, Button, Code, HStack, Text, VStack } from '@chakra-ui/react';
import { FiCopy, FiDownload } from 'react-icons/fi';
import React from 'react';

const ResultsDisplay = ({ result, status }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocr-result.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">
        Status: {status}
      </Text>
      {result && (
        <Box
          p={4}
          bg="gray.100"
          borderRadius="md"
          maxH="400px"
          overflowY="auto"
        >
          <Code
            as="pre"
            p={4}
            borderRadius="md"
            w="100%"
            whiteSpace="pre-wrap"
            wordBreak="break-all"
          >
            {JSON.stringify(result, null, 2)}
          </Code>
        </Box>
      )}
      {result && (
        <HStack spacing={4}>
          <Button leftIcon={<FiCopy />} colorScheme="gray" onClick={handleCopy}>
            Copy JSON
          </Button>
          <Button leftIcon={<FiDownload />} colorScheme="gray" onClick={handleDownload}>
            Download JSON
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default ResultsDisplay;
 