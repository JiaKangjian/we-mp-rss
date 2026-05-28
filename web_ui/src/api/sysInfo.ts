<<<<<<< HEAD
import http from './http'

export const getSysInfo = async (): Promise<any> => {
  const data = await http.get('/wx/sys/info')
  return data
}

export const getSysResources = async (): Promise<any> => {
  const data = await http.get('/wx/sys/resources')
  return data
}

export const refreshArticleStats = async (): Promise<any> => {
  const data = await http.post('/wx/sys/article/refresh')
  return data
=======
import http from './http'

export const getSysInfo = async (): Promise<any> => {
  const data = await http.get('/wx/sys/info')
  return data
}

export const getSysResources = async (): Promise<any> => {
  const data = await http.get('/wx/sys/resources')
  return data
}

export const refreshArticleStats = async (): Promise<any> => {
  const data = await http.post('/wx/sys/article/refresh')
  return data
>>>>>>> cf8b407bc0234127992336de96980c6c65f8f72b
}