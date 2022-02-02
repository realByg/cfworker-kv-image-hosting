import type { Middleware } from '@cfworker/web'
import type { UploadedImage } from '../utils/types'

const listImages: Middleware = async ({ req, res }) => {
	const uploadedImages: UploadedImage[] = []

	const kvList = await ImageKV.list()
	for (let item of kvList.keys) {
		uploadedImages.push({
			id: item.name,
			name: item.metadata['name'],
			src: `${ENV === 'dev' ? 'http://127.0.0.1:8787' : req.url.origin}/img/${item.name}`,
			uploadedAt: item.metadata['uploadedAt'] || 0,
			expiresAt: item.expiration * 1000,
			size: item.metadata['size'] || 0
		})
	}

	res.body = uploadedImages
}

export default listImages
