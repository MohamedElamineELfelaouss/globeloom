import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Custom hook for smooth infinite scroll with optimized performance
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.5,
  rootMargin = '100px'
}) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false
  })

  const [isTriggering, setIsTriggering] = useState(false)

  const triggerLoadMore = useCallback(async () => {
    if (isTriggering || isLoading || !hasMore) return
    
    setIsTriggering(true)
    try {
      await onLoadMore()
    } finally {
      setIsTriggering(false)
    }
  }, [isTriggering, isLoading, hasMore, onLoadMore])

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isTriggering) {
      triggerLoadMore()
    }
  }, [inView, hasMore, isLoading, isTriggering, triggerLoadMore])

  return {
    ref,
    inView,
    isTriggering: isTriggering || isLoading
  }
}

// Smooth scroll container with performance optimizations
export const SmoothScrollContainer = ({ 
  children, 
  hasMore, 
  isLoading, 
  onLoadMore,
  loadingComponent: LoadingComponent,
  emptyComponent: EmptyComponent,
  errorComponent: ErrorComponent,
  error = null,
  className = '',
  itemCount = 0
}) => {
  const { ref: loadMoreRef, isTriggering } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold: 0.1,
    rootMargin: '200px'
  })

  const containerRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  // Error state
  if (error) {
    return ErrorComponent ? <ErrorComponent error={error} /> : (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading content: {error}</p>
      </div>
    )
  }

  // Empty state
  if (itemCount === 0 && !isLoading) {
    return EmptyComponent ? <EmptyComponent /> : (
      <div className="text-center py-8">
        <p className="text-gray-400">No content available</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Content */}
      <motion.div
        layout
        className="space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {children}
        </AnimatePresence>
      </motion.div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isTriggering ? (
            LoadingComponent ? <LoadingComponent /> : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
                />
                <span className="text-gray-400">Loading more posts...</span>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-400 text-sm"
            >
              Scroll down for more
            </motion.div>
          )}
        </div>
      )}

      {/* End of content indicator */}
      {!hasMore && itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 border-t border-white/10"
        >
          <p className="text-gray-400">You've reached the end!</p>
          <p className="text-gray-500 text-sm mt-1">
            {itemCount} post{itemCount !== 1 ? 's' : ''} loaded
          </p>
        </motion.div>
      )}

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg backdrop-blur-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// Optimized list item with virtualization hints
export const OptimizedListItem = ({ 
  children, 
  index, 
  onVisible,
  className = '' 
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && onVisible) {
      onVisible(index)
    }
  }, [inView, index, onVisible])

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Loading skeleton for smooth loading states
export const PostSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-600/50 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-600/50 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-600/30 rounded w-1/4" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-600/50 rounded w-full" />
      <div className="h-4 bg-gray-600/50 rounded w-4/5" />
      <div className="h-4 bg-gray-600/50 rounded w-3/5" />
    </div>

    {/* Image skeleton */}
    <div className="h-48 bg-gray-600/30 rounded-lg mb-4" />

    {/* Actions skeleton */}
    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
      <div className="h-8 bg-gray-600/30 rounded w-16" />
      <div className="h-8 bg-gray-600/30 rounded w-20" />
      <div className="h-8 bg-gray-600/30 rounded w-16" />
      <div className="h-8 bg-gray-600/30 rounded w-14 ml-auto" />
    </div>
  </div>
)

// Multiple post skeletons
export const PostSkeletons = ({ count = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }, (_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
)

// Performance optimized scroll position tracker
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('down')
  const [isScrolling, setIsScrolling] = useState(false)
  
  const lastScrollY = useRef(0)
  const scrollTimer = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      setScrollPosition(currentScrollY)
      setIsScrolling(true)
      
      lastScrollY.current = currentScrollY

      // Clear existing timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }

      // Set new timer to detect scroll end
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
    }
  }, [])

  return {
    scrollPosition,
    scrollDirection,
    isScrolling
  }
}

// Smooth scroll to element
export const useSmoothScrollTo = () => {
  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }, [])

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom
  }
}

export default {
  SmoothScrollContainer,
  OptimizedListItem,
  PostSkeleton,
  PostSkeletons,
  useInfiniteScroll,
  useScrollPosition,
  useSmoothScrollTo
}
