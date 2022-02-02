import type { Middleware } from '@cfworker/web'
import { dataURLToBlob } from 'blob-util'

const getImageByID: Middleware = async ({ req, res }) => {
	const imageID = req.params.imageID

	const dataURL = await ImageKV.get(imageID, { cacheTtl: 3600 })
	if (!dataURL) {
		res.status = 404
		return
	}

	res.body = dataURLToBlob(dataURL)
}

export default getImageByID
