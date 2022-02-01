import axios from 'axios'
import { ElNotification as elNotify } from 'element-plus'
import type { ConvertedImg } from './types'

const request = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 20000
})

request.interceptors.response.use(
	(response) => response.data,
	(error) => {
		elNotify({
			title: error.response.status,
			message: error.message || error.response.data,
			duration: 0,
			type: 'error'
		})
		return Promise.reject(error)
	}
)

export const requestGetImgs = () => request.get('/api/imgs')
export const requestUploadImgs = (data: ConvertedImg[]) => request.post('/api/imgs', data)
export const requestDeleteImgs = (data: string[]) => request.delete('/api/imgs', { data })
