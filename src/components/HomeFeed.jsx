// src/components/HomeFeed.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PostList from './PostList';
import Navbar from './Navbar';

export const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
      setFilteredPosts(data);
    }
  };

  const handleSearch = (query) => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="bg-purple-500 min-h-screen">
      <Navbar onSearch={handleSearch} />
      <div className="container mx-auto py-8">
        <PostList posts={filteredPosts} fetchPosts={fetchPosts} />
      </div>
    </div>
  );
};

export default HomeFeed;