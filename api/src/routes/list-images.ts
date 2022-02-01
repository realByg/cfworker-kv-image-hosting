import { Middleware } from '@cfworker/web'
import { ConvertedImage } from '../utils/types'

const listImages: Middleware = async ({ req, res }) => {
	const convertedImages: ConvertedImage[] = []

	const kvList = await KV.list()
	for (let item of kvList.keys) {
		convertedImages.push({
			id: item.name,
			name: item.metadata['name'],
			dataURL: '',
			src: `${ENV === 'dev' ? 'http://127.0.0.1:8787' : req.url.origin}/img/${item.name}`,
			uploadedAt: item.metadata['uploadedAt'],
			expiresAt: item.expiration * 1000,
			size: item.metadata['size']
		})
	}

	res.body = convertedImages
}

export default listImages
