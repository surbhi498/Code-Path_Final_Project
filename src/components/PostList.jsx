import React from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export const PostList = ({ posts, fetchPosts }) => {
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
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Order by:</h2>
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-2 py-1 rounded-md">Newest</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Most Popular</button>
        </div>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-md">
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
  );
};

export default PostList;