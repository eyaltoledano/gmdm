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
import NftDetail from './components/nftDetail';
import DM from './components/dm';
import ProtectedRoute from './services/protectedRoute';
import { Toaster } from 'react-hot-toast';

const fetcher = url => Api.get(url).then(res => res.data);

const react_app_thirdweb_client_id = process.env.REACT_APP_THIRDWEB_CLIENT_ID;
const react_app_alchemy_key = process.env.REACT_APP_ALCHEMY_KEY;

const App = () => {
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
              credentials: true,
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
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                />
                {isLoading && <Loading variant='ball' size='lg' />}
                {!isLoading && (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                      <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>}>
                        <Route path=":dm_id" element={<ProtectedRoute><DM /></ProtectedRoute>} />
                        <Route index element={<ProtectedRoute><div>Choose a thread or create a new one</div></ProtectedRoute>} />
                      </Route>
                      <Route path="/collections" element={<CollectionsPage />} />
                      <Route path="/collections/:collection_slug" element={<CollectionDetail />} />
                      <Route path="/collections/:collection_slug/:token_id" element={<NftDetail />} /> 
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