import type { Middleware } from '@cfworker/web'

const __MANIFEST = JSON.parse(ENV === 'prod' ? __STATIC_CONTENT_MANIFEST : '')

const staticContent: Middleware = async ({ req, res }, next) => {
	if (ENV === 'dev') {
		await next()
		return
	}

	if (req.method !== 'GET') {
		await next()
		return
	}

	const reqPath = req.url.pathname
	if (reqPath === '/') {
		res.headers.set('Content-Type', 'text/html')
		res.body = await __STATIC_CONTENT.get(__MANIFEST['index.html'], {
			cacheTtl: Number(TTL)
		})
	} else if (reqPath === '/favicon.ico') {
		res.headers.set('Content-Type', 'image/x-icon')
		res.body = await __STATIC_CONTENT.get(__MANIFEST['favicon.ico'], {
			type: 'stream',
			cacheTtl: Number(TTL)
		})
	} else if (/^\/assets\/.+.(js|css)$/.test(reqPath)) {
		if (reqPath.endsWith('.js')) {
			res.headers.set('Content-Type', 'application/javascript')
		} else if (reqPath.endsWith('.css')) {
			res.headers.set('Content-Type', 'text/css')
		}
		res.body = await __STATIC_CONTENT.get(__MANIFEST[reqPath.substring(1)], {
			cacheTtl: Number(TTL)
		})
	} else {
		await next()
	}
}

export default staticContent
