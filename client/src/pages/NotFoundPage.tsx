import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas-bg flex flex-col items-center justify-center text-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-8xl font-black bg-gradient-brand bg-clip-text text-transparent mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">This page doesn't exist or was moved.</p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Go home
        </Link>
      </motion.div>
    </div>
  )
}
