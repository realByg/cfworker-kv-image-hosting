import type { Middleware } from '@cfworker/web'

const getImageByID: Middleware = async ({ req, res }) => {
    const imageID = req.params.imageID

    const imageStream = await ImageKV.get(imageID, { cacheTtl: Number(TTL), type: 'stream' })
    if (!imageStream) {
        res.status = 404
        return
    }

    res.body = imageStream
}

export default getImageByID
