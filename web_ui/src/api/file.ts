<<<<<<< HEAD
import http from './http'
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<{code: number, url: string}>('/wx/user/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
=======
import http from './http'
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return http.post<{code: number, url: string}>('/wx/user/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
>>>>>>> cf8b407bc0234127992336de96980c6c65f8f72b
}