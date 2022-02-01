import { Middleware } from '@cfworker/web'
import type { ConvertedImage } from '../utils/types'

const uploadImages: Middleware = async ({ req, res }) => {
	const imageList: ConvertedImage[] = await req.body.json()

	for (let item of imageList) {
		await KV.put(item.id, item.dataURL, {
			expiration: item.expiresAt
				? Math.floor(new Date(item.expiresAt).getTime() / 1000)
				: undefined,
			metadata: {
				name: item.name,
				uploadedAt: new Date().getTime()
			}
		})
	}

	res.status = 200
}

export default uploadImages
