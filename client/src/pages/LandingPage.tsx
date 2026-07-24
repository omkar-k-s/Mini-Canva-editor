import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdDesignServices, MdSpeed, MdLayers, MdFileDownload,
  MdAutoAwesome, MdArrowForward,
} from 'react-icons/md'

const FEATURES = [
  {
    icon: <MdDesignServices className="w-6 h-6" />,
    title: 'Powerful Canvas Editor',
    desc: 'Fabric.js-powered canvas with shapes, text, images, and full layer management.',
    color: 'text-accent-purple',
    bg:    'bg-accent-purple/10',
  },
  {
    icon: <MdSpeed className="w-6 h-6" />,
    title: '60 FPS Performance',
    desc: 'RAF-throttled rendering and memoized state keeps the canvas smooth with 300+ objects.',
    color: 'text-accent-blue',
    bg:    'bg-accent-blue/10',
  },
  {
    icon: <MdLayers className="w-6 h-6" />,
    title: 'Full Layer Control',
    desc: 'Drag-to-reorder layers, rename, lock, hide, duplicate and delete — all in one panel.',
    color: 'text-accent-green',
    bg:    'bg-accent-green/10',
  },
  {
    icon: <MdFileDownload className="w-6 h-6" />,
    title: 'Export Anywhere',
    desc: 'Export your designs as PNG, JPEG, or print-ready PDF at up to 3× resolution.',
    color: 'text-accent-orange',
    bg:    'bg-accent-orange/10',
  },
  {
    icon: <MdAutoAwesome className="w-6 h-6" />,
    title: '6 Built-in Templates',
    desc: 'Start fast with Instagram Posts, Posters, Flyers, Certificates, Resumes and Business Cards.',
    color: 'text-accent-pink',
    bg:    'bg-accent-pink/10',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const LandingPage = memo(() => {
  return (
    <div className="min-h-screen bg-canvas-bg text-slate-900 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-canvas-bg/80 backdrop-blur-md border-b border-canvas-border">
        <span className="text-lg font-bold bg-gradient-brand bg-clip-text text-transparent">
          Mini Canva
        </span>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/editor"
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Try Free
            <MdArrowForward className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-14">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/15 rounded-full blur-3xl animate-pulse-slow [animation-delay:1.5s]" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl animate-pulse-slow [animation-delay:3s]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-4 py-1.5 text-sm text-primary-300 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            High-Performance Design Editor
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6">
            Design{' '}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              anything
            </span>
            <br />in your browser
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A Canva-inspired editor built for 60 FPS performance.
            Shapes, text, images, layers, templates, and export — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/editor"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-glow-purple hover:scale-105 duration-200"
            >
              Start designing free
              <MdArrowForward className="w-5 h-5" />
            </Link>
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-900/10 text-slate-900 font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Editor preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-16 w-full max-w-5xl mx-auto"
        >
          <div className="bg-editor-toolbar border border-canvas-border rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            {/* Fake toolbar */}
            <div className="flex items-center gap-3 px-4 h-10 border-b border-canvas-border bg-editor-toolbar">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-accent-red/70" />
                <div className="w-3 h-3 rounded-full bg-accent-orange/70" />
                <div className="w-3 h-3 rounded-full bg-accent-green/70" />
              </div>
              <span className="text-xs text-slate-500 flex-1 text-center">Mini Canva Editor</span>
            </div>
            {/* Fake canvas area */}
            <div className="flex bg-[#111118] h-64 items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]" />
              <div className="bg-white/5 border border-white/10 rounded-xl w-72 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent mb-2">
                    YOUR DESIGN
                  </div>
                  <div className="w-16 h-1 bg-accent-pink rounded mx-auto" />
                </div>
              </div>
            </div>
          </div>
          {/* Glow reflection */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-600/20 blur-2xl rounded-full" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Everything you need to
            <span className="bg-gradient-brand bg-clip-text text-transparent"> create</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Production-quality tools crafted for designers who demand performance.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="bg-editor-panel border border-canvas-border rounded-2xl p-6 hover:border-primary-500/40 transition-colors group"
            >
              <div className={['w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.bg, feature.color].join(' ')}>
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-primary-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-primary-600/10 to-transparent border border-primary-500/20 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to create?</h2>
          <p className="text-slate-500 mb-8">No sign-up required. Jump straight into the editor.</p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-glow-purple hover:scale-105 duration-200"
          >
            Open Editor <MdArrowForward className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-canvas-border py-8 text-center text-sm text-slate-500">
        Built with ❤️ for hackathon · Mini Canva © 2026
      </footer>
    </div>
  )
})

LandingPage.displayName = 'LandingPage'
export default LandingPage
