import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LikeButton, 
  CommentButton, 
  ShareButton, 
  BookmarkButton, 
  CommentInput, 
  CommentItem 
} from './SocialInteractions'
import { 
  UserIcon,
  MapPinIcon,
  HashtagIcon,
  EllipsisVerticalIcon,
  PhotoIcon
} from '@heroicons/react/24/solid'

// Post header component
const PostHeader = ({ post, onUserClick, onMenuClick }) => (
  <div className="flex items-center justify-between mb-4">
    <motion.div 
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => onUserClick && onUserClick(post.author._id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        {post.author?.avatar ? (
          <img 
            src={post.author.avatar} 
            alt="" 
            className="w-full h-full rounded-full object-cover" 
          />
        ) : (
          <UserIcon className="w-6 h-6 text-white" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-white">
          {post.author?.displayName || `${post.author?.firstName} ${post.author?.lastName}` || 'Unknown User'}
        </h3>
        <p className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
          {post.location && (
            <span className="ml-2 inline-flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {post.location.name}
            </span>
          )}
        </p>
      </div>
    </motion.div>
    
    <motion.button 
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      onClick={() => onMenuClick && onMenuClick(post._id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
    </motion.button>
  </div>
)

// Post content component
const PostContent = ({ post, onTagClick }) => (
  <div className="mb-4">
    <motion.p 
      className="text-white whitespace-pre-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {post.content}
    </motion.p>
    
    {/* Tags */}
    {post.tags && post.tags.length > 0 && (
      <motion.div 
        className="flex flex-wrap gap-2 mt-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {post.tags.map((tag, i) => (
          <motion.span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm cursor-pointer hover:bg-purple-500/30 transition-colors"
            onClick={() => onTagClick && onTagClick(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HashtagIcon className="w-3 h-3" />
            {tag}
          </motion.span>
        ))}
      </motion.div>
    )}
  </div>
)

// Post images component with smooth loading and hover effects
const PostImages = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState(new Set())
  
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }

  if (!images || images.length === 0) return null

  return (
    <motion.div 
      className="mb-4 grid grid-cols-2 gap-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {images.slice(0, 4).map((image, i) => (
        <motion.div
          key={i}
          className={`relative overflow-hidden rounded-lg cursor-pointer ${
            images.length === 1 ? 'col-span-2' : ''
          } ${images.length === 3 && i === 0 ? 'col-span-2' : ''}`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            // Could open image modal here
            console.log('Open image modal for:', image)
          }}
        >
          <motion.img
            src={image}
            alt=""
            className="w-full h-48 object-cover"
            onLoad={() => handleImageLoad(i)}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: loadedImages.has(i) ? 1 : 0,
              scale: loadedImages.has(i) ? 1 : 1.1
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Loading placeholder */}
          {!loadedImages.has(i) && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          )}
          
          {/* More images indicator */}
          {images.length > 4 && i === 3 && (
            <motion.div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-white font-semibold">
                +{images.length - 4} more
              </span>
            </motion.div>
          )}
          
          {/* Hover overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          >
            <PhotoIcon className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Post stats component with animated counters
const PostStats = ({ stats }) => {
  const animatedStats = useMemo(() => ({
    totalLikes: stats?.totalLikes || 0,
    totalComments: stats?.totalComments || 0,
    totalShares: stats?.totalShares || 0,
    totalViews: stats?.totalViews || 0
  }), [stats])

  return (
    <motion.div 
      className="flex items-center gap-6 text-sm text-gray-400 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <motion.span
        key={animatedStats.totalLikes}
        initial={{ scale: 1.2, color: '#ef4444' }}
        animate={{ scale: 1, color: '#9ca3af' }}
        transition={{ duration: 0.3 }}
      >
        {animatedStats.totalLikes} likes
      </motion.span>
      <motion.span
        key={animatedStats.totalComments}
        initial={{ scale: 1.2, color: '#3b82f6' }}
        animate={{ scale: 1, color: '#9ca3af' }}
        transition={{ duration: 0.3 }}
      >
        {animatedStats.totalComments} comments
      </motion.span>
      <motion.span
        key={animatedStats.totalShares}
        initial={{ scale: 1.2, color: '#10b981' }}
        animate={{ scale: 1, color: '#9ca3af' }}
        transition={{ duration: 0.3 }}
      >
        {animatedStats.totalShares} shares
      </motion.span>
      <span>{animatedStats.totalViews} views</span>
    </motion.div>
  )
}

// Comments section with smooth expand/collapse
const CommentsSection = ({ 
  post, 
  isExpanded, 
  commentInput, 
  onCommentChange, 
  onCommentSubmit, 
  userAvatar,
  onCommentLike,
  onCommentReply 
}) => (
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="border-t border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="p-6">
          {/* Comment Input */}
          <div className="mb-4">
            <CommentInput
              value={commentInput}
              onChange={onCommentChange}
              onSubmit={onCommentSubmit}
              userAvatar={userAvatar}
              placeholder="Write a comment..."
            />
          </div>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {post.comments.map((comment, i) => (
                <CommentItem
                  key={comment._id || i}
                  comment={comment}
                  index={i}
                  onLike={onCommentLike}
                  onReply={onCommentReply}
                />
              ))}
            </motion.div>
          )}
          
          {/* No comments state */}
          {(!post.comments || post.comments.length === 0) && (
            <motion.div 
              className="text-center text-gray-500 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>Be the first to comment!</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

// Main enhanced post component
const EnhancedPost = ({ 
  post, 
  index,
  isLiking = false,
  commentInput = '',
  isCommentsExpanded = false,
  userAvatar,
  onLike,
  onComment,
  onCommentChange,
  onShare,
  onBookmark,
  onTagClick,
  onUserClick,
  onMenuClick,
  onCommentLike,
  onCommentReply
}) => {
  const [imageErrors, setImageErrors] = useState(new Set())

  const handleImageError = (imageIndex) => {
    setImageErrors(prev => new Set([...prev, imageIndex]))
  }

  const handleCommentSubmit = useCallback(() => {
    if (commentInput.trim()) {
      onComment(post._id)
    }
  }, [commentInput, onComment, post._id])

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 group"
      whileHover={{ 
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}
    >
      {/* Post Header */}
      <PostHeader 
        post={post}
        onUserClick={onUserClick}
        onMenuClick={onMenuClick}
      />

      {/* Post Content */}
      <PostContent 
        post={post}
        onTagClick={onTagClick}
      />

      {/* Post Images */}
      <PostImages images={post.images} />

      {/* Post Stats */}
      <PostStats stats={post.stats} />

      {/* Action Buttons */}
      <motion.div 
        className="flex items-center gap-4 border-t border-white/10 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <LikeButton
          isLiked={post.isLiked}
          count={post.stats?.totalLikes || 0}
          onToggle={() => onLike(post._id)}
          disabled={isLiking}
        />
        
        <CommentButton
          count={post.stats?.totalComments || 0}
          onClick={() => onComment(post._id)}
          isExpanded={isCommentsExpanded}
        />
        
        <ShareButton
          count={post.stats?.totalShares || 0}
          onShare={() => onShare(post._id)}
        />
        
        <BookmarkButton
          isBookmarked={post.isBookmarked}
          onToggle={() => onBookmark(post._id)}
        />
      </motion.div>

      {/* Comments Section */}
      <CommentsSection
        post={post}
        isExpanded={isCommentsExpanded}
        commentInput={commentInput}
        onCommentChange={onCommentChange}
        onCommentSubmit={handleCommentSubmit}
        userAvatar={userAvatar}
        onCommentLike={onCommentLike}
        onCommentReply={onCommentReply}
      />
    </motion.article>
  )
}

export default EnhancedPost
