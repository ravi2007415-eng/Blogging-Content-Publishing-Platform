import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { MessageSquare, Send, User } from 'lucide-react';
import { MOCK_COMMENTS } from '../mockData';

export const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const created = {
      id: Date.now(),
      content: newComment.trim(),
      authorName: user?.name || 'Guest Contributor',
      authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    };

    setComments([created, ...comments]);
    setNewComment('');
  };

  return (
    <section id="comments" className="comments-section glass-panel">
      <div className="section-title-wrapper">
        <MessageSquare className="accent-icon" size={22} />
        <h3>Discussion ({comments.length})</h3>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-avatar">
          {isAuthenticated ? (
            <img src={user?.avatarUrl} alt="User Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder"><User size={18} /></div>
          )}
        </div>
        <div className="form-input-group">
          <textarea
            className="input-field comment-textarea"
            rows="3"
            placeholder={isAuthenticated ? "Share your technical insight..." : "Log in or type to join the discussion..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="btn btn-primary send-btn" disabled={!newComment.trim()}>
            <Send size={16} />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card glass-card">
            <img src={comment.authorAvatar} alt={comment.authorName} className="comment-avatar" />
            <div className="comment-body">
              <div className="comment-meta">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
