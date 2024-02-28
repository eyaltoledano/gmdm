import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Collections from './components/collections'
import Home from './pages/home'
import Messages from './pages/messages'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        {/* 
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/collections/:collectionId" element={<CollectionDetail />} />
          <Route path="/collections/:collectionId/nfts/:nftId" element={<NftDetail />} /> 
        */}
      </Routes>
    </Router>
  )
}

export default App