import axios from 'axios'
import { ElNotification as elNotify } from 'element-plus'
import type { UploadedImage } from './types'

const request = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 20000
})

request.interceptors.response.use(
	(response) => response.data,
	(error) => {
		elNotify({
			message: error?.response?.data || String(error),
			duration: 0,
			type: 'error'
		})
		return Promise.reject(error)
	}
)

export const requestListImages = (): Promise<UploadedImage[]> => request.get('/api/imgs')
export const requestUploadImages = (data: FormData) => request.post('/api/imgs', data)
export const requestDeleteImage = (data: string) => request.delete('/api/img', { data })
