// src/components/PostDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const handleUpvote = async () => {
    if (post) {
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error upvoting post:', error);
      } else {
        setPost(data);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">Posted {new Date(post.created_at).toLocaleString()}</p>
      {post.image_url && <img src={post.image_url} alt="Post" className="w-full my-4 rounded" />}
      <p className="my-4">{post.content}</p>
      <p className="font-semibold">{post.upvotes} upvotes</p>
      <button onClick={handleUpvote} className="bg-teal-500 text-white px-4 py-2 rounded">Upvote</button>
    </div>
  );
};

export default PostDetails;