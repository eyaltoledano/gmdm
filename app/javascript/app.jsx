import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout'
import { AppProvider } from './services/context';
import HomePage from './pages/home'
import InboxPage from './pages/inbox'
import SettingsPage from './pages/settings';
import CollectionsPage from './pages/collections';
import CollectionDetail from './components/collectionDetail';

// RainbowKit
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  goerli,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Loading } from 'react-daisyui';

const config = getDefaultConfig({
  appName: 'gmdm',
  projectId: '611738803ed16f41fef230cb1142c4dd',
  chains: [mainnet, goerli, sepolia],
  ssr: false,
});

const queryClient = new QueryClient();


const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AppProvider>
              {isLoading && <Loading variant='ball' size='lg' />}
              {!isLoading && (
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/inbox" element={<InboxPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/collections/:collection_slug" element={<CollectionDetail />} />
                    {/* 
                      <Route path="/collections/:collection_slug/nfts/:nftId" element={<NftDetail />} /> 
                    */}
                  </Routes>
                </Layout>
              )}
            </AppProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  )
}

export default App