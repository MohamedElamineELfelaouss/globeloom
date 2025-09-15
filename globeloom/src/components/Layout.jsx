import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './custom/Header.jsx'
import Footer from './custom/Footer.jsx'

function Layout() {
  return (    <div className="min-h-screen bg-premium-dark relative">
      {/* Simplified background layers for better performance */}
      <div className="absolute inset-0 bg-elite-gradient opacity-80" />
      <div className="absolute inset-0 bg-professional-mesh opacity-20" />
      
      {/* Reduced ambient lighting effects */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-aurora-glow opacity-8 blur-2xl" />
        {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="pt-16 lg:pt-18">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
