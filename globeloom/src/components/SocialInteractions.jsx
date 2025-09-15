import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/solid'
import { 
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftIcon as ChatOutline,
  ShareIcon as ShareOutline,
  BookmarkIcon as BookmarkOutline
} from '@heroicons/react/24/outline'

// Floating hearts animation for likes
const FloatingHearts = ({ show }) => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    if (show) {
      const newHearts = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        delay: i * 0.1
      }))
      setHearts(newHearts)
      
      // Clean up hearts after animation
      const timer = setTimeout(() => {
        setHearts([])
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              x: 0, 
              y: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.2, 0.8], 
              x: Math.random() * 60 - 30,
              y: -60 - Math.random() * 40,
              rotate: Math.random() * 60 - 30
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: heart.delay,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <HeartIcon className="w-6 h-6 text-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Like button with smooth animations
export const LikeButton = ({ 
  isLiked, 
  count, 
  onToggle, 
  disabled = false,
  size = "default" 
}) => {
  const [showFloatingHearts, setShowFloatingHearts] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = async () => {
    if (disabled || isAnimating) return
    
    setIsAnimating(true)
    
    // Show floating hearts if liking
    if (!isLiked) {
      setShowFloatingHearts(true)
    }
    
    // Call the onToggle function
    await onToggle()
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false)
      setShowFloatingHearts(false)
    }, 600)
  }

  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5"

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isLiked
          ? 'text-red-500 bg-red-500/20 hover:bg-red-500/30'
          : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
      } ${disabled || isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {isLiked ? (
          <HeartIcon className={`${iconSize} text-red-500`} />
        ) : (
          <HeartOutline className={iconSize} />
        )}
        <FloatingHearts show={showFloatingHearts} />
      </motion.div>
      <span className="font-medium">{count > 0 ? count : 'Like'}</span>
    </motion.button>
  )
}

// Comment button with count
export const CommentButton = ({ 
  count, 
  onClick, 
  isExpanded = false,
  size = "default" 
}) => {
  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5"

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isExpanded
          ? 'text-blue-500 bg-blue-500/20 hover:bg-blue-500/30'
          : 'text-gray-400 hover:text-blue-500 hover:bg-blue-500/10'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <ChatBubbleOvalLeftIcon className={iconSize} />
      <span className="font-medium">{count > 0 ? count : 'Comment'}</span>
    </motion.button>
  )
}

// Share button with animation
export const ShareButton = ({ 
  count, 
  onShare, 
  disabled = false,
  size = "default" 
}) => {
  const [isSharing, setIsSharing] = useState(false)
  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5"

  const handleShare = async () => {
    if (disabled || isSharing) return
    
    setIsSharing(true)
    await onShare()
    
    setTimeout(() => {
      setIsSharing(false)
    }, 1000)
  }

  return (
    <motion.button
      onClick={handleShare}
      disabled={disabled || isSharing}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-green-500 hover:bg-green-500/10 ${
        disabled || isSharing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={isSharing ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ShareOutline className={iconSize} />
      </motion.div>
      <span className="font-medium">{count > 0 ? count : 'Share'}</span>
    </motion.button>
  )
}

// Bookmark button with smooth toggle
export const BookmarkButton = ({ 
  isBookmarked, 
  onToggle, 
  disabled = false,
  size = "default" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5"

  const handleClick = async () => {
    if (disabled || isAnimating) return
    
    setIsAnimating(true)
    await onToggle()
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ml-auto ${
        isBookmarked
          ? 'text-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30'
          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
      } ${disabled || isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={isBookmarked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isBookmarked ? (
          <BookmarkIcon className={iconSize} />
        ) : (
          <BookmarkOutline className={iconSize} />
        )}
      </motion.div>
      <span className="font-medium">Save</span>
    </motion.button>
  )
}

// Comment input with smooth animations
export const CommentInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Write a comment...",
  userAvatar,
  disabled = false 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSubmit()
      inputRef.current?.blur()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
        {userAvatar ? (
          <img src={userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className="flex-1 relative">
        <motion.input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-white/10 border transition-all duration-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 pr-12 ${
            isFocused 
              ? 'border-purple-500/50 focus:ring-purple-500 bg-white/15' 
              : 'border-white/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          animate={{
            scale: isFocused ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        />
        
        <motion.button
          type="submit"
          disabled={!value.trim() || disabled}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-300 ${
            value.trim() && !disabled
              ? 'text-purple-500 hover:bg-purple-500/20 cursor-pointer'
              : 'text-gray-500 cursor-not-allowed'
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: value.trim() && !disabled ? 1.1 : 1 }}
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.form>
  )
}

// Comment display with smooth animations
export const CommentItem = ({ 
  comment, 
  index,
  onLike,
  onReply 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start gap-3"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
        {comment.user?.avatar ? (
          <img src={comment.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className="flex-1">
        <motion.div 
          className="bg-white/10 rounded-lg p-3"
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-semibold text-white text-sm">
            {comment.user?.displayName || `${comment.user?.firstName} ${comment.user?.lastName}` || 'Unknown User'}
          </p>
          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
        </motion.div>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          <motion.button 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLike && onLike(comment._id)}
          >
            Like
          </motion.button>
          <motion.button 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReply && onReply(comment._id)}
          >
            Reply
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default {
  LikeButton,
  CommentButton,
  ShareButton,
  BookmarkButton,
  CommentInput,
  CommentItem
}
