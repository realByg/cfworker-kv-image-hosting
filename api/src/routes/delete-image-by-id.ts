import type { Middleware } from '@cfworker/web'

const deteleImageByID: Middleware = async ({ req, res }) => {
	const imageID = await req.body.text()

	await KV.delete(imageID)

	res.status = 200
}

export default deteleImageByID
