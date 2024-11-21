// src/components/PostForm.jsx
import React from 'react';
import { supabase } from '../supabaseClient';

export const PostForm = ({ onSubmit }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPost = {
      title: formData.get('title'),
      content: formData.get('content'),
      image_url: formData.get('image'), // Use image_url to match the database column
    };

    try {
      // Insert the new post into the Supabase database
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost], { returning: 'representation' }); // Ensure the inserted data is returned

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        onSubmit(data[0]); // Pass the created post data to the onSubmit callback
        e.target.reset();
      } else {
        console.error('No data returned from insert operation');
        console.log('Inserted post:', newPost);
      }
    } catch (error) {
      console.error('Error inserting new post:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div className="mb-4">
        <textarea
          name="content"
          placeholder="Content (Optional)"
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        ></textarea>
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="image"
          placeholder="Image URL (Optional)"
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md">
        Create Post
      </button>
    </form>
  );
};

export default PostForm;