export {}

declare global {
	const ENV: 'dev' | 'prod'
	const PASSWORD: string
	const USERNAME: string
	const TTL: number
	const ImageKV: KVNamespace
	const __STATIC_CONTENT: KVNamespace
	const __STATIC_CONTENT_MANIFEST: string
}
