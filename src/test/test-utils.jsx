import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
// extendTheme is imported from @chakra-ui/system, not @chakra-ui/react in some environments
import { extendTheme } from '@chakra-ui/system';

// Create a default theme for tests
const theme = extendTheme({});

const AllTheProviders = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything from testing-library
export * from '@testing-library/react';

// override the default render method
export { customRender as render };
