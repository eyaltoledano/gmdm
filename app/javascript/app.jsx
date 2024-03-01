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
import { ThirdwebProvider, metamaskConfig, rainbowConfig, walletConnectConfig, coinbaseConfig } from "thirdweb/react";
import { ethereum, sepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

const App = (props) => {
  const { envVars } = props;
  const { react_app_thirdweb_client_id, react_app_alchemy_id } = envVars;
  const [isLoading, setIsLoading] = useState(true);

  const client = createThirdwebClient({
    clientId: react_app_thirdweb_client_id,
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const sdkOptions = {
    alchemyApiKey: react_app_alchemy_id,
  }

  return (
    <Router>
        <ThirdwebProvider
          sdkOptions={sdkOptions}
          client={client}
          authConfig={{
            authUrl: '/auth',
            domain: 'https://localhost:3000'

          }}
          activeChain={sepolia}
          dAppMeta={{
            activeChain: "sepolia",
            name: "gmdm",
            description: "nft-to-nft messaging protocol",
            // logoUrl: "https://example.com/logo.png",
            url: "https://dmgm.app",
            isDarkMode: false,
          }}
          wallets={[
            metamaskConfig({ recommended: true }),
            coinbaseConfig(),
            walletConnectConfig(),
            rainbowConfig(),        ]}
          supportedChains={[ethereum, sepolia]}
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
    </Router>
  )
}

export default App