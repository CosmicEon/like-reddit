// import { CSSReset, ThemeProvider } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS={true} >
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
