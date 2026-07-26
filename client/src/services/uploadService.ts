import api from './api'

export interface UploadResponse {
  url: string
  publicId: string
  width: number
  height: number
}

/**
 * Upload service — sends images to the backend which proxies to Cloudinary.
 * Falls back to a data URL if the server is unavailable.
 */
export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('image', file)

    const { data } = await api.post<{ data: UploadResponse }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  /**
   * Client-side base64 fallback when backend is unavailable.
   */
  toDataUrl: (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          const max = 1200
          if (width > max || height > max) {
            if (width > height) {
              height *= max / width
              width = max
            } else {
              width *= max / height
              height = max
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    }),
}
