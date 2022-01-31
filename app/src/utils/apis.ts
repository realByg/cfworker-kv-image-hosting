import request from './request'
import type { ConvertedImg } from './types'

export const apiLogin = () => request.post('/api/login')

export const apiGetImgs = () => request.get('/api/imgs')

export const apiUploadImgs = (data: ConvertedImg[]) => request.post('/api/imgs', { data })

export const apiDeleteImgs = (data: string[]) => request.delete('/api/imgs', { data })
