import type { Middleware } from '@cfworker/web'

const deleteImage: Middleware = async ({ req, res }) => {
	const imageID = await req.body.text()
	await ImageKV.delete(imageID)
	res.status = 200
}

export default deleteImage
