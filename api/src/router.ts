import { Router, validate } from '@cfworker/web'
import type { UploadedImage } from './utils/types'
import { ArrayBuffer as md5ArrayBuffer } from 'spark-md5'
import { nanoid } from 'nanoid'

const router = new Router()

const __MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST)

router.get('/', async ({ res }) => {
	res.headers.set('Content-Type', 'text/html')
	res.body = await __STATIC_CONTENT.get(__MANIFEST['index.html'], {
		cacheTtl: Number(TTL)
	})
})

router.get('/favicon.ico', async ({ res }) => {
	res.headers.set('Content-Type', 'image/x-icon')
	res.body = await __STATIC_CONTENT.get(__MANIFEST['favicon.ico'], {
		type: 'stream',
		cacheTtl: Number(TTL)
	})
})

router.get(
	'/assets/:fileName',
	validate({
		params: {
			required: ['fileName']
		}
	}),
	async ({ req, res }) => {
		const fileName = req.params.fileName
		if (fileName.endsWith('.js')) {
			res.headers.set('Content-Type', 'application/javascript')
		} else if (fileName.endsWith('.css')) {
			res.headers.set('Content-Type', 'text/css')
		}
		res.body = await __STATIC_CONTENT.get(__MANIFEST[`assets/${fileName}`], {
			cacheTtl: Number(TTL)
		})
	}
)

router.get(
	'/img/:imageID',
	validate({
		params: {
			required: ['imageID']
		}
	}),
	async ({ req, res }) => {
		const imageID = req.params.imageID

		const imageStream = await ImageKV.get(imageID, { cacheTtl: Number(TTL), type: 'stream' })
		if (!imageStream) {
			res.status = 404
			return
		}

		res.body = imageStream
	}
)

router.get('/api/imgs', async ({ req, res }) => {
	const uploadedImages: UploadedImage[] = []

	const kvList = await ImageKV.list()
	for (let item of kvList.keys) {
		uploadedImages.push({
			name: item.metadata['name'],
			src: `${ENV === 'dev' ? 'http://127.0.0.1:8787' : req.url.origin}/img/${item.name}`,
			uploadedAt: item.metadata['uploadedAt'] || 0,
			expiresAt: item.expiration * 1000,
			size: item.metadata['size'] || 0
		})
	}

	res.body = uploadedImages
})

router.post('/api/imgs', async ({ req, res }) => {
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
})

router.delete('/api/img', async ({ req, res }) => {
	const imageID = await req.body.text()
	await ImageKV.delete(imageID)
	res.status = 200
})

router.all('/(.*)', ({ res }) => {
	// cors options
	if (ENV === 'dev') {
		res.status = 200
		return
	}

	res.redirect('/')
})

export default router
