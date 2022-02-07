import type { Middleware } from '@cfworker/web'
import { ArrayBuffer as md5ArrayBuffer } from 'spark-md5'
import { nanoid } from 'nanoid'

const uploadImages: Middleware = async ({ req, res }) => {
	const formData = await req.body.formData()

	const expiration = Math.floor(Number(formData.get('Expiration')) / 1000) || undefined
	const images = formData.getAll('Images')

	for (let item of images) {
		if (typeof item !== 'string') {
			let imageID: string
			if (DEDUPE === 'true') {
				imageID = md5ArrayBuffer.hash(await item.arrayBuffer()).slice(0, 8)
			} else {
				imageID = nanoid(8)
			}

			await ImageKV.put(imageID, item.stream(), {
				expiration,
				metadata: {
					name: item.name,
					uploadedAt: new Date().getTime(),
					size: item.size
				}
			})
		}
	}

	res.status = 200
}

export default uploadImages
