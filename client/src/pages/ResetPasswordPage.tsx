import React, { memo, useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/authService'
import { MdLock, MdArrowForward } from 'react-icons/md'
import toast from 'react-hot-toast'

const ResetPasswordPage = memo(() => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {}
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [password, confirmPassword])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !token) return

    setLoading(true)
    try {
      const result = await authService.resetPassword(token, password)
      toast.success(result.message)
      navigate('/auth')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Password reset failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [password, validate, token, navigate])

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
            Set your new password
          </p>
        </div>

        {/* Card */}
        <div className="bg-editor-panel border border-canvas-border rounded-2xl p-8 shadow-panel">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<MdLock className="w-4 h-4" />}
              placeholder="••••••••"
              id="reset-password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<MdLock className="w-4 h-4" />}
              placeholder="••••••••"
              id="reset-confirm-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<MdArrowForward className="w-4 h-4" />}
            >
              Reset Password
            </Button>
            
            <div className="text-center mt-4">
              <Link
                to="/auth"
                className="text-sm text-slate-500 hover:text-slate-600 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
})

ResetPasswordPage.displayName = 'ResetPasswordPage'
export default ResetPasswordPage
