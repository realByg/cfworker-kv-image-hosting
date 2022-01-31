import axios from 'axios'
import { ElNotification } from 'element-plus'
import store from '../plugins/store'
import { getBasicToken } from './local-storage'
import type { ConvertedImg } from './types'

const request = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 20000
})

request.interceptors.request.use(
	(config) => {
		const basicToken = getBasicToken()
		if (basicToken) {
			config.headers = {
				...config.headers,
				Authorization: `Basic ${basicToken}`
			}
		}
		return config
	},
	(error) => Promise.reject(error)
)

request.interceptors.response.use(
	(response) => response.data,
	(error) => {
		if (error.response) {
			const status = error.response.status
			const e = error.response.data

			switch (status) {
				case 401:
					ElNotification({
						message: e,
						type: 'warning'
					})
					store.commit('setLoginAreaVisible', true)
					break

				default:
					ElNotification({
						message: e,
						duration: 0,
						type: 'error'
					})
			}
		} else {
			ElNotification({
				message: error.message,
				duration: 0,
				type: 'error'
			})
		}

		return Promise.reject(error)
	}
)

export const requestLogin = () => request.get('/api/login')

export const requestGetImgs = () => request.get('/api/imgs')

export const requestUploadImgs = (data: ConvertedImg[]) => request.post('/api/imgs', { data })

export const requestDeleteImgs = (data: string[]) => request.delete('/api/imgs', { data })
