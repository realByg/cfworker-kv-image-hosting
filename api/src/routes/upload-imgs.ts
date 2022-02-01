import { Middleware } from '@cfworker/web'
import type { ConvertedImg } from '../utils/types'

const uploadImgs: Middleware = async ({ req, res }) => {
	try {
		const imgList: ConvertedImg[] = await req.body.json()

		for (const img of imgList) {
			await KVIMG.put(img.id, img.dataURL, {
				expiration: img.expiresAt ? img.expiresAt / 1000 : undefined,
				metadata: {
					name: img.name,
					uploadedAt: new Date().getTime()
				}
			})
		}

		res.status = 200
	} catch (error) {
		res.status = 500
		res.body = String(error)
	}
}

export default uploadImgs
