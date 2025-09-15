import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import ViewTrip from './view-trip/index.jsx'
import MyTrips from './my-trips/index.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Import all pages
import LandingPage from './pages/CleanLandingPage'
import CreateTripPage from './pages/CreateTrip'
import ExplorePage from './pages/ExplorePage'
import MyTripsPage from './pages/MyTrips'
import Community from './pages/Community'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TripDetails from './pages/TripDetails'
import Leaderboard from './pages/Leaderboard'
import About from './pages/About'
import Pricing from './pages/Pricing'
import TripRecommendations from './pages/TripRecommendations'
import CountriesExplorerPage from './pages/CountriesExplorerPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import ErrorBoundary from './components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'sign-in',
        element: <SignIn />
      },
      {
        path: 'sign-up',
        element: <SignUp />
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: 'create-trip',
        element: <ProtectedRoute><CreateTripPage /></ProtectedRoute>
      },
      {
        path: 'ai-recommendations',
        element: <TripRecommendations />
      },
      {
        path: 'trip/:tripId',
        element: <ProtectedRoute><TripDetails /></ProtectedRoute>
      },
      {
        path: 'explore',
        element: <ExplorePage />
      },
      {
        path: 'destination/:id',
        element: <DestinationDetailPage />
      },
      {
        path: 'countries',
        element: <ErrorBoundary><CountriesExplorerPage /></ErrorBoundary>
      },
      {
        path: 'explore/countries',
        element: <ErrorBoundary><CountriesExplorerPage /></ErrorBoundary>
      },
      {
        path: 'my-trips',
        element: <ProtectedRoute><MyTripsPage /></ProtectedRoute>
      },
      {
        path: 'community',
        element: <ProtectedRoute><Community /></ProtectedRoute>
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'pricing',
        element: <Pricing />
      },
      // Legacy routes for backwards compatibility
      {
        path: 'view-trip/:tripId',
        element: <ViewTrip />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
