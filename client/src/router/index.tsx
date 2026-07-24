import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// ── All pages are lazy-loaded for code splitting ──────────────────────────────
const LandingPage   = lazy(() => import('@/pages/LandingPage'))
const AuthPage      = lazy(() => import('@/pages/AuthPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const EditorPage    = lazy(() => import('@/pages/EditorPage'))
const NotFoundPage  = lazy(() => import('@/pages/NotFoundPage'))

// ── Loading fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
    <LoadingSpinner size="lg" message="Loading..." />
  </div>
)

// ── Router configuration ──────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/editor',
    element: (
      <Suspense fallback={<PageLoader />}>
        <EditorPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
