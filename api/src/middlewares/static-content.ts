import type { Middleware } from '@cfworker/web'
import { getType as getMimeType } from 'mime'

const __FILES_MANIFEST = JSON.parse(ENV === 'prod' ? __STATIC_CONTENT_MANIFEST : null)

const staticContent: Middleware = async ({ req, res }, next) => {
	if (ENV === 'dev' || req.method !== 'GET') {
		await next()
		return
	}

	let filePath: string
	if (req.url.pathname === '/') {
		filePath = 'index.html'
	} else {
		filePath = req.url.pathname.slice(1)
	}

	if (filePath in __FILES_MANIFEST) {
		const contentType = getMimeType(filePath)
		const kvKey = __FILES_MANIFEST[filePath]

		res.headers.set('Content-Type', contentType)
		res.body = await __STATIC_CONTENT.get(kvKey, {
			cacheTtl: Number(TTL),
			type: 'arrayBuffer'
		})
		return
	}

	await next()
}

export default staticContent
