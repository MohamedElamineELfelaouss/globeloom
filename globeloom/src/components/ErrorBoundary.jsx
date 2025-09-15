import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }
  componentDidCatch(_error, errorInfo) {
    this.setState({
      error: _error,
      errorInfo: errorInfo
    })
    console.error('ErrorBoundary caught an error:', _error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-midnight-950 flex items-center justify-center p-6">
          <div className="max-w-2xl mx-auto bg-midnight-800/50 border border-red-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>            <details className="text-red-300 text-sm mb-4">
              <summary className="cursor-pointer mb-2">Error Details</summary>
              <pre className="whitespace-pre-wrap bg-midnight-900 p-4 rounded">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && '\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="bg-aurora-500 hover:bg-aurora-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
