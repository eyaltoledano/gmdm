import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Messages from './pages/messages'
import Layout from './components/layout'
import { AppProvider } from './services/context';
//  add wallet provider here for rainbowkit

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
            {/* 
              <Route path="/collections" element={<CollectionList />} />
              <Route path="/collections/:collectionId" element={<CollectionDetail />} />
              <Route path="/collections/:collectionId/nfts/:nftId" element={<NftDetail />} /> 
            */}
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  )
}

export default App