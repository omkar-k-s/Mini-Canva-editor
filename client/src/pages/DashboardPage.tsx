import React, { memo, useEffect, useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdAdd, MdLogout, MdDesignServices, MdDelete,
  MdOpenInNew, MdSearch,
} from 'react-icons/md'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import { projectService } from '@/services/projectService'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import type { ProjectListItem } from '@/types/project.types'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const DashboardPage = memo(() => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { projects, isLoading, setProjects, setLoading, removeProject, setCurrentProject } = useProjectStore()
  const [search, setSearch] = useState('')

  // Load projects on mount
  useEffect(() => {
    setLoading(true)
    projectService.getAll()
      .then(setProjects)
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [setProjects, setLoading])

  const openProject = useCallback(async (project: ProjectListItem) => {
    try {
      const full = await projectService.getById(project._id)
      setCurrentProject(full)
      navigate('/editor')
    } catch {
      toast.error('Failed to open project')
    }
  }, [setCurrentProject, navigate])

  const deleteProject = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('Delete this project? This action cannot be undone.')) return
    try {
      await projectService.delete(id)
      removeProject(id)
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }, [removeProject])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
  }, [logout, navigate])

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-canvas-bg text-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-14 border-b border-canvas-border bg-editor-toolbar sticky top-0 z-20">
        <Link to="/" className="text-lg font-black bg-gradient-brand bg-clip-text text-transparent">
          Mini Canva
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {user?.name || 'Guest'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<MdLogout className="w-4 h-4" />}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Designs</h1>
            <p className="text-sm text-slate-500 mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/editor"
            onClick={() => setCurrentProject(null)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-glow-purple text-sm"
          >
            <MdAdd className="w-5 h-5" />
            New Design
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-xs">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MdSearch className="w-4 h-4" />}
            id="dashboard-search"
          />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" message="Loading your projects..." />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasProjects={projects.length > 0} />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => openProject(project)}
                onDelete={(e) => deleteProject(e, project._id)}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
})

DashboardPage.displayName = 'DashboardPage'
export default DashboardPage

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectListItem
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

const ProjectCard = memo(({ project, onClick, onDelete }: ProjectCardProps) => {
  return (
    <motion.div
      variants={cardVariant}
      onClick={onClick}
      className="group relative bg-editor-panel border border-canvas-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary-500/50 transition-all hover:shadow-panel"
    >
      {/* Thumbnail */}
      <div
        className="aspect-video flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: project.backgroundColor || '#1a1a2e' }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <MdDesignServices className="w-10 h-10 text-slate-900/20" />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="flex gap-2 opacity-0 group-hover:opacity-100"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onClick() }}
              className="bg-white/90 text-black p-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-white transition-colors"
              aria-label={`Open ${project.title}`}
            >
              <MdOpenInNew className="w-4 h-4" />
              Open
            </button>
          </motion.div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-slate-900 truncate">{project.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {project.canvasWidth} × {project.canvasHeight}px ·{' '}
          {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 text-slate-900 p-1 rounded-lg hover:bg-accent-red/80 transition-all"
        aria-label={`Delete ${project.title}`}
      >
        <MdDelete className="w-4 h-4" />
      </button>
    </motion.div>
  )
})

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(({ hasProjects }: { hasProjects: boolean }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="text-6xl mb-4">🎨</div>
    <h3 className="text-xl font-semibold text-slate-900 mb-2">
      {hasProjects ? 'No results found' : "You haven't created anything yet"}
    </h3>
    <p className="text-sm text-slate-500 mb-6">
      {hasProjects
        ? 'Try a different search term'
        : 'Start with a blank canvas or pick a template'}
    </p>
    {!hasProjects && (
      <Link
        to="/editor"
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
      >
        <MdAdd className="w-4 h-4" />
        Create your first design
      </Link>
    )}
  </div>
))
