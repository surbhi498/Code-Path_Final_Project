// src/components/PostDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: '', content: '', image_url: '' });

  useEffect(() => {
    fetchPost();
    fetchComments();
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
      setEditedPost({ title: data.title, content: data.content, image_url: data.image_url });
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: newComment }]);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('posts')
      .update(editedPost)
      .eq('id', id)
      .select(); // Use select() to return the updated rows

    if (error) {
      console.error('Error updating post:', error);
    } else if (data.length === 0) {
      console.error('No rows returned from update operation');
    } else {
      setPost(data[0]);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      navigate('/');
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
      {editing ? (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <textarea
            value={editedPost.content}
            onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
          <input
            type="text"
            value={editedPost.image_url}
            onChange={(e) => setEditedPost({ ...editedPost, image_url: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            Save Changes
          </button>
          <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-gray-500">Posted {new Date(post.created_at).toLocaleString()}</p>
          {post.image_url && <img src={post.image_url} alt="Post" className="w-full my-4 rounded" />}
          <p className="my-4">{post.content}</p>
          <p className="font-semibold">{post.upvotes} upvotes</p>
          <button onClick={handleUpvote} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            Upvote
          </button>
          <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
            Edit
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2">
            Delete
          </button>
        </>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 mt-2">
            Submit
          </button>
        </form>
        {comments.map((comment) => (
          <div key={comment.id} className="border-t border-gray-300 pt-4 mt-4">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500">Posted {new Date(comment.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;