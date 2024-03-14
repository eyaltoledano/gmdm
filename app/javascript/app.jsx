import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout'
import { AppProvider } from './services/context';
import HomePage from './pages/home'
import InboxPage from './pages/inbox'
import SettingsPage from './pages/settings';
import CollectionsPage from './pages/collections';
import CollectionDetail from './components/collectionDetail';
import { Loading } from 'react-daisyui';
import { Ethereum, Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider, metamaskWallet, rainbowWallet, walletConnect, coinbaseWallet } from "@thirdweb-dev/react";
import { SWRConfig } from 'swr';
import Api from './services/api';

const fetcher = url => Api.get(url).then(res => res.data);

const App = (props) => {
  const { envVars } = props;
  const { react_app_thirdweb_client_id, react_app_alchemy_key } = envVars;
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const sdkOptions = {
    alchemyApiKey: react_app_alchemy_key,
  }

  return (
    <Router>
      <SWRConfig value={{ fetcher }}>
        <ThirdwebProvider
          sdkOptions={sdkOptions}
          clientId={react_app_thirdweb_client_id}
          authConfig={{
            authUrl: '/auth',
            domain: window.location.origin,
            cors: {
              origin: 'localhost:3000',
              // credentials: true,
            },
          }}
          activeChain={Ethereum}
          dAppMeta={{
            activeChain: "ethereum",
            name: "gmdm",
            description: "nft-to-nft messaging protocol",
            url: "https://dmgm.app",
            isDarkMode: false,
          }}
          wallets={[
            metamaskWallet({ recommended: true }),
            rainbowWallet,
            walletConnect,
            coinbaseWallet,
          ]}
          supportedChains={[Ethereum, Sepolia]}
        >
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
        </ThirdwebProvider>
      </SWRConfig>
    </Router>
  )
}

export default App