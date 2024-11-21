import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const PostList = ({ posts, fetchPosts }) => {
  const [sortOrder, setSortOrder] = useState('newest');

  const handleUpvote = async (id, currentUpvotes) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error upvoting post:', error);
    } else {
      fetchPosts(); // Refresh the posts list after upvoting
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOrder === 'popular') {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Order by:</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleSort('newest')}
            className={`px-2 py-1 rounded-md ${sortOrder === 'newest' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Newest
          </button>
          <button
            onClick={() => handleSort('popular')}
            className={`px-4 py-2 rounded ${sortOrder === 'popular' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Most Popular
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <div key={post.id} className="border p-4 rounded-md bg-white shadow-md">
            <Link to={`/post/${post.id}`} className="text-xl font-semibold text-teal-600 hover:underline">
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">Posted {new Date(post.created_at).toLocaleString()}</p>
            <p>{post.upvotes} upvotes</p>
            <button
              onClick={() => handleUpvote(post.id, post.upvotes)}
              className="bg-teal-500 text-white px-4 py-2 rounded"
            >
              Upvote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;