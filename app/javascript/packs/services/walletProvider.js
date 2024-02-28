import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [chain.mainnet], // You can add more chains if needed
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Your NFT Messaging App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export const WalletProvider = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
);
