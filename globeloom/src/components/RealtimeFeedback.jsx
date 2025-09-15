import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/solid'

// Toast notification component for real-time feedback
export const Toast = ({ 
  message, 
  type = 'success', // success, error, info, warning
  duration = 3000,
  onClose,
  icon: CustomIcon
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400'
      case 'error':
        return 'bg-red-500/90 text-white border-red-400'
      case 'warning':
        return 'bg-yellow-500/90 text-black border-yellow-400'
      case 'info':
        return 'bg-blue-500/90 text-white border-blue-400'
      default:
        return 'bg-gray-500/90 text-white border-gray-400'
    }
  }

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-5 h-5" />
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5" />
      default:
        return <InformationCircleIcon className="w-5 h-5" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg ${getToastStyles()}`}
    >
      {getIcon()}
      <span className="flex-1 font-medium">{message}</span>
      <motion.button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <XMarkIcon className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

// Toast container to manage multiple toasts
export const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemoveToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Instant feedback for social actions
export const ActionFeedback = ({ 
  type, // like, comment, share, bookmark
  isVisible,
  onComplete 
}) => {
  const getFeedbackContent = () => {
    switch (type) {
      case 'like':
        return {
          icon: HeartIcon,
          message: 'Liked!',
          color: 'text-red-500',
          bgColor: 'bg-red-500/20'
        }
      case 'comment':
        return {
          icon: ChatBubbleOvalLeftIcon,
          message: 'Comment added!',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20'
        }
      case 'share':
        return {
          icon: ShareIcon,
          message: 'Shared!',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20'
        }
      case 'bookmark':
        return {
          icon: BookmarkIcon,
          message: 'Saved!',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20'
        }
      default:
        return {
          icon: CheckCircleIcon,
          message: 'Done!',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20'
        }
    }
  }

  const { icon: Icon, message, color, bgColor } = getFeedbackContent()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete && onComplete()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${bgColor} ${color} px-6 py-4 rounded-full backdrop-blur-md border border-current/20 shadow-lg flex items-center gap-3`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <span className="font-semibold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading indicator for smooth transitions
export const SmoothLoader = ({ 
  isVisible, 
  message = "Loading...",
  size = "default" // small, default, large
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4 border-2'
      case 'large':
        return 'w-8 h-8 border-4'
      default:
        return 'w-6 h-6 border-2'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${getSizeClasses()} border-purple-500 border-t-transparent rounded-full`}
          />
          {message && <span className="text-gray-400 text-sm">{message}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Progress indicator for optimistic updates
export const OptimisticIndicator = ({ 
  isActive, 
  progress = 0, 
  action = "Processing..." 
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 bg-purple-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-md shadow-lg z-40"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            <span className="text-sm font-medium">{action}</span>
          </div>
          <motion.div 
            className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Pulse animation for active elements
export const PulseIndicator = ({ 
  isActive, 
  children, 
  color = "purple" 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'ring-red-500'
      case 'blue':
        return 'ring-blue-500'
      case 'green':
        return 'ring-green-500'
      case 'yellow':
        return 'ring-yellow-500'
      default:
        return 'ring-purple-500'
    }
  }

  return (
    <motion.div
      className={`relative ${isActive ? `${getColorClasses()} ring-2` : ''}`}
      animate={isActive ? {
        boxShadow: [
          `0 0 0 0 ${color === 'red' ? 'rgba(239, 68, 68, 0.7)' : 
                    color === 'blue' ? 'rgba(59, 130, 246, 0.7)' :
                    color === 'green' ? 'rgba(16, 185, 129, 0.7)' :
                    color === 'yellow' ? 'rgba(245, 158, 11, 0.7)' :
                    'rgba(147, 51, 234, 0.7)'}`,
          `0 0 0 10px ${color === 'red' ? 'rgba(239, 68, 68, 0)' : 
                       color === 'blue' ? 'rgba(59, 130, 246, 0)' :
                       color === 'green' ? 'rgba(16, 185, 129, 0)' :
                       color === 'yellow' ? 'rgba(245, 158, 11, 0)' :
                       'rgba(147, 51, 234, 0)'}`
        ]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: isActive ? Infinity : 0,
        repeatType: "loop"
      }}
    >
      {children}
    </motion.div>
  )
}

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message, options = {}) => {
    addToast({ message, type: 'success', ...options })
  }

  const showError = (message, options = {}) => {
    addToast({ message, type: 'error', ...options })
  }

  const showInfo = (message, options = {}) => {
    addToast({ message, type: 'info', ...options })
  }

  const showWarning = (message, options = {}) => {
    addToast({ message, type: 'warning', ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

export default {
  Toast,
  ToastContainer,
  ActionFeedback,
  SmoothLoader,
  OptimisticIndicator,
  PulseIndicator,
  useToast
}
