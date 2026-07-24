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
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    }),
}
