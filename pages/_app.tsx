import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  sepolia, Chain
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, darkTheme, midnightTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { ChakraProvider, extendTheme} from '@chakra-ui/react'
import { WagmiContractsProvider } from '../utils/ContractsProvider';


const blastMainnet: Chain = {
  id: 81457, // The chainId of your new network
  name: 'Blast',
  rpcUrls: {
    default: {
      http: ["https://lingering-indulgent-replica.blast-mainnet.quiknode.pro/6667a8f4be701cb6549b415d567bc706fb2f13a8/"],
      // Add other properties required by ChainRpcUrls here
    },
    // You can add other RPC URL configurations under different keys if needed
  },
  nativeCurrency: {
    name: 'Blast',
    symbol: 'ETH', // The symbol for the native currency
    decimals: 18,
  },
  blockExplorers: {
    default: { name: 'Blast Explorer', url: 'https://blastscan.io/' },
  },
  testnet: false,
  // Include other properties from the Chain type as necessary
};

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    blastMainnet,
    
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
}); 

const client = new QueryClient();

const colors = {
  primary: {
    background: '#2B2C30',
    text: 'rgba(238,241,240,1)',
    700: '#cb7600',
    600: '#F6BD01',
    500: '#29EEFE',
    400: '#1F287A',
    300: '#171941'
  },
  secondary: {
    900: '#01111E',
    800: '#04082E'
  }
}

const styles = {


  global: {

    'html, body, root': {
      margin: '0',
      padding: '0',
      lineHeight: 'tall',
      minHeight: '100vh',
      // bgImage: backgroundImage,

      bgColor : '#2B2C30',
      boxSizing: 'border-box'
    },
    // a: {
    //   fontSize: "20px",
    //   textDecoration: "none"
    // }
  },
}

const fonts = {
  fonts: {
    body: "TT Firs",
  }
}

const breakpoints = {
  sm: '360px',
  ip: '390px',
  md: '620px',
  lg: '960px',
  xl: '1200px',
  doublexl: '1536px',
}

const theme = extendTheme({ colors, styles, breakpoints, fonts });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
 <WagmiContractsProvider>

        <RainbowKitProvider  modalSize='compact' locale='en-US' theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          fontStack: 'system',
          overlayBlur: 'small'
        })} >
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </RainbowKitProvider>  
         </WagmiContractsProvider>
           </QueryClientProvider>
    

  
     
        
    </WagmiProvider>
  );
}

export default MyApp;
