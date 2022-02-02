import type { Middleware } from '@cfworker/web'
import type { ConvertedImage } from '../utils/types'

const uploadImages: Middleware = async ({ req, res }) => {
	const convertedImage: ConvertedImage[] = await req.body.json()

	for (let item of convertedImage) {
		await ImageKV.put(item.id, item.dataURL, {
			expiration: item.expiresAt ? Math.floor(item.expiresAt / 1000) : undefined,
			metadata: {
				name: item.name,
				uploadedAt: new Date().getTime(),
				size: item.dataURL.length
			}
		})
	}

	res.status = 200
}

export default uploadImages
