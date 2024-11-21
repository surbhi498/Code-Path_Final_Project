// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeFeed from './components/HomeFeed';
import PostForm from './components/PostForm';
import PostDetails from './components/PostDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create-post" element={<PostForm />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}

export default App;