import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout'
import { AppProvider } from './services/context';
import HomePage from './pages/home'
import InboxPage from './pages/inbox'
import SettingsPage from './pages/settings';
import CollectionsPage from './pages/collections';
import CollectionDetail from './components/collectionDetail';
//  add wallet provider here for rainbowkit

const App = () => {
  return (
    <Router>
      <AppProvider>
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
      </AppProvider>
    </Router>
  )
}

export default App