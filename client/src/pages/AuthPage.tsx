import React, { memo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { MdEmail, MdLock, MdPerson, MdArrowForward } from 'react-icons/md'
import toast from 'react-hot-toast'

type Mode = 'login' | 'register' | 'forgot-password'

const AuthPage = memo(() => {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const [mode,     setMode]     = useState<Mode>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {}
    if (mode === 'register' && !name.trim()) e.name = 'Name is required'
    if (!email.trim())   e.email    = 'Email is required'
    if (!email.includes('@')) e.email = 'Invalid email'
    if (mode !== 'forgot-password' && password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [mode, name, email, password])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      if (mode === 'forgot-password') {
        const result = await authService.forgotPassword(email)
        toast.success(result.message)
        setMode('login')
      } else {
        let result
        if (mode === 'login') {
          result = await authService.login({ email, password })
        } else {
          result = await authService.register({ name, email, password })
        }
        setUser(result.user)
        setToken(result.token)
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
        navigate('/dashboard')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server (Server might be down)' : 'Authentication failed')
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [mode, name, email, password, validate, setUser, setToken, navigate])

  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black bg-gradient-brand bg-clip-text text-transparent">
            Mini Canva
          </Link>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === 'login' ? 'Sign in to your account' : mode === 'register' ? 'Create your free account' : 'Reset your password'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-editor-panel border border-canvas-border rounded-2xl p-8 shadow-panel">
          {/* Mode switcher */}
          {mode !== 'forgot-password' && (
            <div className="flex bg-editor-input rounded-xl p-1 mb-6">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setErrors({}) }}
                  className={[
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                    mode === m
                      ? 'bg-primary-600 text-white shadow'
                      : 'text-slate-500 hover:text-slate-900',
                  ].join(' ')}
                  aria-pressed={mode === m}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Full name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    leftIcon={<MdPerson className="w-4 h-4" />}
                    placeholder="John Doe"
                    id="auth-name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<MdEmail className="w-4 h-4" />}
              placeholder="you@example.com"
              id="auth-email"
            />
            {mode !== 'forgot-password' && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<MdLock className="w-4 h-4" />}
                placeholder="••••••••"
                id="auth-password"
              />
            )}

            {mode === 'login' && (
              <div className="flex justify-end !mt-1">
                <button
                  type="button"
                  onClick={() => { setMode('forgot-password'); setErrors({}) }}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<MdArrowForward className="w-4 h-4" />}
              aria-label={mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'}
            >
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </Button>
            
            {mode === 'forgot-password' && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrors({}) }}
                  className="text-sm text-slate-500 hover:text-slate-600"
                >
                  Back to Login
                </button>
              </div>
            )}
          </form>

          {/* Skip to editor */}
          <div className="mt-4 pt-4 border-t border-canvas-border text-center">
            <Link
              to="/editor"
              className="text-sm text-slate-500 hover:text-slate-600 transition-colors"
            >
              Skip — use without account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
})

AuthPage.displayName = 'AuthPage'
export default AuthPage
