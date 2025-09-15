import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService_enhanced'
import ConnectionMonitor from '../components/ConnectionMonitor'
import { useBackendConnection } from '../hooks/useBackendConnection'
import EnhancedPost from '../components/EnhancedPost'
import { SmoothScrollContainer, PostSkeletons } from '../components/SmoothScrolling'
import { ToastContainer, useToast, ActionFeedback, OptimisticIndicator } from '../components/RealtimeFeedback'
import { 
  LikeButton, 
  CommentButton, 
  ShareButton, 
  BookmarkButton 
} from '../components/SocialInteractions'
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  HandThumbUpIcon,
  UserIcon,
  MapIcon,
  EllipsisVerticalIcon,
  PhotoIcon,
  MapPinIcon,
  HashtagIcon,  XMarkIcon,
  UserPlusIcon,
  UserMinusIcon,
  GlobeAltIcon,
  SparklesIcon,
  TrophyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutline, ChatBubbleOvalLeftIcon, ShareIcon as ShareOutline } from '@heroicons/react/24/outline'

function Community() {
  const { user } = useAuth()
  const { connectionStatus, reconnect, isConnecting } = useBackendConnection()
  const toast = useToast()
  
  // State management with enhanced real-time features
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  // Community data
  const [communityStats, setCommunityStats] = useState({
    activeTravelers: 0,
    storiesShared: 0,
    countriesCovered: 0
  })
  const [trendingTags, setTrendingTags] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  
  // Post creation state
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImages, setNewPostImages] = useState([])
  const [newPostLocation, setNewPostLocation] = useState('')
  const [newPostTags, setNewPostTags] = useState('')
  const [creatingPost, setCreatingPost] = useState(false)
    // Enhanced UI state for smooth interactions
  const [expandedComments, setExpandedComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [actionFeedback, setActionFeedback] = useState({ type: null, isVisible: false })
  const [optimisticActions, setOptimisticActions] = useState(new Set())
  
  // Image viewer state
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentPostImages, setCurrentPostImages] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
    const fileInputRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  
  // Define loadPostsForTab function before using it in useEffect
  const loadPostsForTab = useCallback(async (tab, pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)
      
      console.log(`🔄 Loading posts for tab: ${tab}, page: ${pageNum}`)
      
      const filter = tab === 'following' ? 'following' : 
                    tab === 'trending' ? 'trending' : 
                    tab === 'bookmarks' ? 'saved' : 'all'
      
      let response;
      if (tab === 'bookmarks') {
        response = await apiService.getBookmarks({ page: pageNum, limit: 10 })
      } else {
        // Build params object, only include tags if searchQuery exists
        const params = { 
          filter, 
          page: pageNum, 
          limit: 10
        }
          // Only add tags if debouncedSearchQuery is not empty
        if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
          params.tags = debouncedSearchQuery.trim()
        }
        
        response = await apiService.getCommunityPosts(params)
      }

      console.log(`📊 Response for tab ${tab}:`, response)

      if (response && response.success) {
        const newPosts = response.data.posts || []
        if (append) {
          setPosts(prev => [...prev, ...newPosts])
        } else {
          setPosts(newPosts)
        }
        setHasMore(response.data.pagination?.pages > pageNum)
        setPage(pageNum)
        console.log(`✅ Loaded ${newPosts.length} posts for tab: ${tab}`)
      } else {
        // Handle case where response is not in expected format
        console.warn(`⚠️ No data for tab ${tab}:`, response)
        if (append) {
          // Don't append if no new data
        } else {
          setPosts([])
        }
        setHasMore(false)
      }
    } catch (error) {
      console.error(`❌ Error loading posts for tab ${tab}:`, error)
      setError(`Failed to load ${tab} posts`)
      // Set empty state on error
      if (!append) {
        setPosts([])
      }
      setHasMore(false)    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [debouncedSearchQuery])
  
  // Initial data load - only once
  useEffect(() => {
    loadInitialData()
  }, [])
    // Load posts when tab changes
  useEffect(() => {
    loadPostsForTab(activeTab, 1)
  }, [activeTab, loadPostsForTab])
  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 300)
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])
  
  // Effect to reload posts when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      loadPostsForTab(activeTab, 1)
    }
  }, [debouncedSearchQuery, activeTab, loadPostsForTab])
    const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Only load static data - posts will be loaded by tab change effect
      
      // Load optional data (don't fail if these don't work)
      try {
        const statsResponse = await apiService.getCommunityStats()
        if (statsResponse && statsResponse.success) {
          setCommunityStats(statsResponse.data.stats || {
            activeTravelers: 0,
            storiesShared: 0,
            countriesCovered: 0
          })
        }
      } catch (err) {
        console.warn('Stats not available:', err.message)
      }

      try {
        const tagsResponse = await apiService.getTrendingTags(10)
        if (tagsResponse && tagsResponse.success) {
          setTrendingTags(tagsResponse.data.trendingTags || [])
        }
      } catch (err) {
        console.warn('Trending tags not available:', err.message)
      }

      try {
        const usersResponse = await apiService.getSuggestedUsers(5)
        if (usersResponse && usersResponse.success) {
          setSuggestedUsers(usersResponse.data.suggestedUsers || [])
        }
      } catch (err) {
        console.warn('Suggested users not available:', err.message)
      }
      
      setError(null)
    } catch (error) {
      console.error('Error loading initial data:', error)
      setError('Failed to load community data. Please check your connection.')
      // Set default empty state
      setCommunityStats({
        activeTravelers: 0,
        storiesShared: 0,
        countriesCovered: 0
      })
      setTrendingTags([])
      setSuggestedUsers([])
    } finally {
      setLoading(false)
    }
  }
  
  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      loadPostsForTab(activeTab, page + 1, true)
    }
  }
    const handleCreatePost = useCallback(async () => {
    if (!newPostContent.trim()) return

    try {
      setCreatingPost(true)
      
      const postData = {
        content: newPostContent,
        images: newPostImages,
        location: newPostLocation ? { name: newPostLocation } : undefined,
        tags: newPostTags.split(',').map(tag => tag.trim()).filter(Boolean),
        visibility: 'public'
      }

      const response = await apiService.createPost(postData)
      
      if (response.success) {
        // Add new post to the beginning with smooth animation
        setPosts(prev => [response.data.post, ...prev])
        
        // Reset form
        setNewPostContent('')
        setNewPostImages([])
        setNewPostLocation('')
        setNewPostTags('')
        setShowCreatePost(false)
        
        // Update stats optimistically
        setCommunityStats(prev => ({
          ...prev,
          storiesShared: prev.storiesShared + 1
        }))
        
        toast.showSuccess('Post created successfully!')
      } else {
        toast.showError('Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.showError('Failed to create post')
    } finally {
      setCreatingPost(false)
    }
  }, [newPostContent, newPostImages, newPostLocation, newPostTags, toast])
  const handleToggleLike = useCallback(async (postId) => {
    const actionKey = `like-${postId}`
    if (optimisticActions.has(actionKey)) return

    try {
      setOptimisticActions(prev => new Set([...prev, actionKey]))
      
      // Optimistic update - instant visual feedback like Instagram/Facebook
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              stats: { 
                ...post.stats, 
                totalLikes: post.isLiked ? post.stats.totalLikes - 1 : post.stats.totalLikes + 1 
              }
            }
          : post
      ))

      // Show instant feedback
      setActionFeedback({ type: 'like', isVisible: true })
      
      const response = await apiService.toggleLikePost(postId)
      
      if (!response.success) {
        // Revert on failure
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                stats: { 
                  ...post.stats, 
                  totalLikes: post.isLiked ? post.stats.totalLikes + 1 : post.stats.totalLikes - 1 
                }
              }
            : post
        ))
        toast.showError('Failed to update like')
      } else {
        toast.showSuccess(response.data.isLiked ? 'Post liked!' : 'Like removed')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert optimistic update
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              stats: { 
                ...post.stats, 
                totalLikes: post.isLiked ? post.stats.totalLikes + 1 : post.stats.totalLikes - 1 
              }
            }
          : post
      ))
      toast.showError('Failed to update like')
    } finally {
      setOptimisticActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }, [optimisticActions, toast])
  const handleAddComment = useCallback(async (postId) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return

    const actionKey = `comment-${postId}`
    if (optimisticActions.has(actionKey)) return

    try {
      setOptimisticActions(prev => new Set([...prev, actionKey]))
      
      // Create optimistic comment for instant feedback
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        user: {
          _id: user._id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        },
        content,
        createdAt: new Date().toISOString()
      }

      // Optimistic update - instant visual feedback
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: [...(post.comments || []), optimisticComment],
              stats: { ...post.stats, totalComments: (post.stats?.totalComments || 0) + 1 }
            }
          : post
      ))

      // Clear input immediately for smooth UX
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))

      // Show feedback
      setActionFeedback({ type: 'comment', isVisible: true })
      
      const response = await apiService.addComment(postId, content)
      
      if (response.success) {
        // Replace optimistic comment with real one
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: [
                  ...(post.comments || []).filter(c => c._id !== optimisticComment._id),
                  response.data.comment
                ],
                stats: { ...post.stats, totalComments: response.data.totalComments }
              }
            : post
        ))
        toast.showSuccess('Comment added!')
      } else {
        // Remove optimistic comment on failure
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: (post.comments || []).filter(c => c._id !== optimisticComment._id),
                stats: { ...post.stats, totalComments: (post.stats?.totalComments || 1) - 1 }
              }
            : post
        ))
        // Restore input
        setCommentInputs(prev => ({ ...prev, [postId]: content }))
        toast.showError('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.showError('Failed to add comment')
      // Restore input on error
      setCommentInputs(prev => ({ ...prev, [postId]: content }))
    } finally {
      setOptimisticActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }, [commentInputs, user, optimisticActions, toast])
  const handleSharePost = useCallback(async (postId) => {
    const actionKey = `share-${postId}`
    if (optimisticActions.has(actionKey)) return

    try {
      setOptimisticActions(prev => new Set([...prev, actionKey]))
      setActionFeedback({ type: 'share', isVisible: true })
      
      const response = await apiService.sharePost(postId)
        if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, totalShares: response.data.totalShares }
              }
            : post
        ))
        toast.showSuccess('Post shared successfully!')
      } else {
        toast.showError('Failed to share post')
      }
    } catch (error) {
      console.error('Error sharing post:', error)
      toast.showError('Failed to share post')
    } finally {
      setOptimisticActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }, [optimisticActions, toast])
  const handleToggleBookmark = useCallback(async (postId) => {
    const actionKey = `bookmark-${postId}`
    if (optimisticActions.has(actionKey)) return

    try {
      setOptimisticActions(prev => new Set([...prev, actionKey]))
      
      // Optimistic update for instant feedback
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isBookmarked: !post.isBookmarked
            }
          : post
      ))

      setActionFeedback({ type: 'bookmark', isVisible: true })
      
      const response = await apiService.toggleBookmarkPost(postId)
      
      if (response.success) {
        toast.showSuccess(response.message)
      } else {
        // Revert on failure
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                isBookmarked: !post.isBookmarked
              }
            : post
        ))
        toast.showError('Failed to update bookmark')
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
      // Revert optimistic update
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isBookmarked: !post.isBookmarked
            }
          : post
      ))
      toast.showError('Failed to update bookmark')
    } finally {
      setOptimisticActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }, [optimisticActions, toast])

  const handleFollowUser = async (userId) => {
    try {
      // Optimistic update
      setSuggestedUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isFollowing: true } : u
      ))
      
      const response = await apiService.followUser(userId)
      
      if (response.success) {
        // Remove from suggestions after successful follow
        setSuggestedUsers(prev => prev.filter(u => u._id !== userId))
      } else {
        // Revert on failure
        setSuggestedUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, isFollowing: false } : u
        ))
      }
    } catch (error) {
      console.error('Error following user:', error)
      // Revert optimistic update
      setSuggestedUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isFollowing: false } : u
      ))
    }
  }
  
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostImages(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }
  
  // Image viewer functions
  const openImageViewer = (post, imageIndex = 0) => {
    setCurrentPost(post)
    setCurrentPostImages(post.images || [])
    setCurrentImageIndex(imageIndex)
    setShowImageViewer(true)
  }
  
  const closeImageViewer = () => {
    setShowImageViewer(false)
    setCurrentPost(null)
    setCurrentPostImages([])
    setCurrentImageIndex(0)
  }
    const nextImage = useCallback(() => {
    if (currentImageIndex < currentPostImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }, [currentImageIndex, currentPostImages.length])
  
  const prevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }, [currentImageIndex])
  
  const handleImageViewerKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      closeImageViewer()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      prevImage()
    }
  }, [nextImage, prevImage])
  
  useEffect(() => {
    if (showImageViewer) {
      document.addEventListener('keydown', handleImageViewerKeyPress)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleImageViewerKeyPress)
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleImageViewerKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [showImageViewer, handleImageViewerKeyPress])
  
  const removeImage = (index) => {
    setNewPostImages(prev => prev.filter((_, i) => i !== index))
  }
  
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const tabs = [
    { id: 'feed', label: 'Feed', icon: ChatBubbleLeftRightIcon },
    { id: 'trending', label: 'Trending', icon: FireIcon },
    { id: 'following', label: 'Following', icon: UserIcon },
    { id: 'bookmarks', label: 'Saved', icon: BookmarkIcon }
  ]

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Connection Monitor */}
      <ConnectionMonitor />
      
      {/* Toast Container for real-time feedback */}
      <ToastContainer 
        toasts={toast.toasts} 
        onRemoveToast={toast.removeToast} 
      />
      
      {/* Action Feedback for instant visual feedback */}
      <ActionFeedback
        type={actionFeedback.type}
        isVisible={actionFeedback.isVisible}
        onComplete={() => setActionFeedback({ type: null, isVisible: false })}
      />

      {/* Optimistic Action Indicator */}
      <OptimisticIndicator
        isActive={optimisticActions.size > 0}
        action="Processing your action..."
        progress={75}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Travel Community</h1>
              <p className="text-gray-300">Connect with fellow travelers and share your journey</p>
            </div>
            
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Create Post
            </Button>
          </div>

          {/* Connection Status Indicator */}
          {connectionStatus && !connectionStatus.connected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-medium">Backend Disconnected</span>
                <span className="text-red-300 text-sm">Some features may be unavailable</span>
              </div>
              <Button
                onClick={reconnect}
                disabled={isConnecting}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                {isConnecting ? 'Reconnecting...' : 'Reconnect'}
              </Button>
            </motion.div>
          )}

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{communityStats.activeTravelers.toLocaleString()}</p>
                  <p className="text-gray-300 text-sm">Active Travelers</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{communityStats.storiesShared.toLocaleString()}</p>
                  <p className="text-gray-300 text-sm">Stories Shared</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <GlobeAltIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{communityStats.countriesCovered}</p>
                  <p className="text-gray-300 text-sm">Countries Covered</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-3">
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />                <input
                  type="text"
                  placeholder="Search posts, tags, locations, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
                  >
                    {/* Post Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            {post.author?.avatar ? (
                              <img src={post.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <UserIcon className="w-5 h-5 text-white" />
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
                        </div>
                        
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-white whitespace-pre-wrap">{post.content}</p>
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm cursor-pointer hover:bg-purple-500/30 transition-colors"
                                onClick={() => {
                                  setSearchQuery(tag)
                                  loadPostsForTab(activeTab, 1)
                                }}
                              >
                                <HashtagIcon className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 gap-2">                          {post.images.slice(0, 4).map((image, i) => (
                            <div
                              key={i}
                              className={`relative overflow-hidden rounded-lg cursor-pointer ${
                                post.images.length === 1 ? 'col-span-2' : ''
                              } ${post.images.length === 3 && i === 0 ? 'col-span-2' : ''}`}
                              onClick={() => openImageViewer(post, i)}
                            >
                              <img
                                src={image}
                                alt=""
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                              />
                              {post.images.length > 4 && i === 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    +{post.images.length - 4} more
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                        <span>{post.stats?.totalLikes || 0} likes</span>
                        <span>{post.stats?.totalComments || 0} comments</span>
                        <span>{post.stats?.totalShares || 0} shares</span>
                        <span>{post.stats?.totalViews || 0} views</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                        <button
                          onClick={() => handleToggleLike(post._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                            post.isLiked
                              ? 'text-red-500 bg-red-500/20 hover:bg-red-500/30'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                          }`}
                        >
                          {post.isLiked ? (
                            <HeartIcon className="w-5 h-5" />
                          ) : (
                            <HeartOutline className="w-5 h-5" />
                          )}
                          Like
                        </button>
                        
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                        >
                          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                          Comment
                        </button>
                        
                        <button
                          onClick={() => handleSharePost(post._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-500/10 transition-all duration-300"
                        >
                          <ShareOutline className="w-5 h-5" />
                          Share
                        </button>
                        
                        <button
                          onClick={() => handleToggleBookmark(post._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ml-auto ${
                            post.isBookmarked
                              ? 'text-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
                          }`}
                        >
                          <BookmarkIcon className="w-5 h-5" />
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {expandedComments[post._id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-white/5"
                        >
                          <div className="p-6">
                            {/* Comment Input */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                {user?.avatar ? (
                                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <UserIcon className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={commentInputs[post._id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(post._id)
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <Button
                                  onClick={() => handleAddComment(post._id)}
                                  disabled={!commentInputs[post._id]?.trim()}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                >
                                  Post
                                </Button>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-3">
                              {(post.comments || []).map((comment, i) => (
                                <motion.div
                                  key={comment._id || i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                    {comment.user?.avatar ? (
                                      <img src={comment.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <UserIcon className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white/10 rounded-lg p-3">
                                      <p className="font-semibold text-white text-sm">
                                        {comment.user?.displayName || `${comment.user?.firstName} ${comment.user?.lastName}` || 'Unknown User'}
                                      </p>
                                      <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      <button className="hover:text-white">Like</button>
                                      <button className="hover:text-white">Reply</button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                ))}
              </AnimatePresence>

              {/* Load More Button */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <Button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg border border-white/20"
                  >
                    {loadingMore ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {loadingMore ? 'Loading...' : 'Load More Stories'}
                  </Button>
                </motion.div>
              )}

              {/* No posts message */}
              {!loading && posts.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-400 mb-2">
                      {activeTab === 'bookmarks' ? 'No saved posts yet' : 'No posts found'}
                    </p>
                    <p className="text-gray-500">
                      {activeTab === 'bookmarks' 
                        ? 'Start bookmarking posts you love!' 
                        : 'Be the first to share your travel story!'}
                    </p>
                  </div>
                  {activeTab !== 'bookmarks' && (
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg"
                    >
                      Share Your Story
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Trending Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <FireIcon className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-white">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {trendingTags.slice(0, 5).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(tag.tag)
                      setActiveTab('trending')
                      loadPostsForTab('trending', 1)
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 group-hover:text-purple-200">#{tag.tag}</span>
                      <span className="text-gray-400 text-sm">{tag.count} posts</span>
                    </div>
                  </button>
                ))}
                
                {trendingTags.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p>No trending topics yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Suggested Travelers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-white">Suggested Travelers</h3>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((suggestedUser) => (
                  <div key={suggestedUser._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                        {suggestedUser.avatar ? (
                          <img src={suggestedUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {suggestedUser.displayName || `${suggestedUser.firstName} ${suggestedUser.lastName}`}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {suggestedUser.followerCount} followers • {suggestedUser.totalPoints} points
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFollowUser(suggestedUser._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {suggestedUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p>No suggestions available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-white">Your Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Points</span>
                  <span className="text-white font-medium">{user?.gamification?.totalPoints || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Level</span>
                  <span className="text-white font-medium">{user?.gamification?.level || 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Following</span>
                  <span className="text-white font-medium">{user?.following?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Followers</span>
                  <span className="text-white font-medium">{user?.followers?.length || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreatePost(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Share Your Travel Story</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Content Textarea */}
                <textarea
                  placeholder="What's your travel story? Share your adventures, tips, or experiences..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />

                {/* Action Buttons Row */}
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    Photos
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add location (e.g., Paris, France)"
                      value={newPostLocation}
                      onChange={(e) => setNewPostLocation(e.target.value)}
                      className="w-full p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <input
                  type="text"
                  placeholder="Add tags separated by commas (e.g., adventure, backpacking, europe)"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Image Previews */}
                {newPostImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {newPostImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || creatingPost}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {creatingPost ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : null}
                    {creatingPost ? 'Sharing...' : 'Share Story'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 px-6 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}
      
      {/* Full-Screen Image Viewer */}
      <AnimatePresence>
        {showImageViewer && currentPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeImageViewer()
              }
            }}
          >
            {/* Image Section */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Navigation Arrows */}
              {currentPostImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className={`absolute left-4 z-10 p-3 rounded-full transition-all duration-200 ${
                      currentImageIndex === 0 
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === currentPostImages.length - 1}
                    className={`absolute right-4 z-10 p-3 rounded-full transition-all duration-200 ${
                      currentImageIndex === currentPostImages.length - 1 
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {/* Current Image */}
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                src={currentPostImages[currentImageIndex]}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Image Counter */}
              {currentPostImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {currentPostImages.length}
                </div>
              )}
            </div>
            
            {/* Comments Sidebar */}
            <div className="w-80 bg-gray-900/50 backdrop-blur-md border-l border-white/10 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    {currentPost.author?.avatar ? (
                      <img src={currentPost.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {currentPost.author?.displayName || `${currentPost.author?.firstName} ${currentPost.author?.lastName}` || 'Unknown User'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(currentPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeImageViewer}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              {/* Post Content */}
              <div className="p-4 border-b border-white/10">
                <p className="text-white text-sm">{currentPost.content}</p>
                {currentPost.tags && currentPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentPost.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                      >
                        <HashtagIcon className="w-2 h-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4 text-red-500" />
                    {currentPost.stats?.totalLikes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChatBubbleOvalLeftIcon className="w-4 h-4 text-blue-400" />
                    {currentPost.stats?.totalComments || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShareIcon className="w-4 h-4 text-green-400" />
                    {currentPost.stats?.totalShares || 0}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <LikeButton
                    isLiked={currentPost.isLiked}
                    likesCount={currentPost.stats?.totalLikes || 0}
                    onLike={() => handleToggleLike(currentPost._id)}
                    size="sm"
                  />
                  <CommentButton
                    commentsCount={currentPost.stats?.totalComments || 0}
                    onComment={() => toggleComments(currentPost._id)}
                    size="sm"
                  />
                  <ShareButton
                    sharesCount={currentPost.stats?.totalShares || 0}
                    onShare={() => handleSharePost(currentPost._id)}
                    size="sm"
                  />
                  <BookmarkButton
                    isBookmarked={currentPost.isBookmarked}
                    onBookmark={() => handleToggleBookmark(currentPost._id)}
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto">
                {currentPost.comments && currentPost.comments.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {currentPost.comments.map((comment, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          {comment.user?.avatar ? (
                            <img src={comment.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <UserIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg px-3 py-2">
                            <p className="text-white font-medium text-xs">
                              {comment.user?.displayName || `${comment.user?.firstName} ${comment.user?.lastName}` || 'Unknown User'}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <ChatBubbleOvalLeftIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet</p>
                  </div>
                )}
              </div>
              
              {/* Comment Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[currentPost._id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [currentPost._id]: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(currentPost._id)
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Connection Monitor */}
      <ConnectionMonitor />
    </div>
  )
}

export default Community
