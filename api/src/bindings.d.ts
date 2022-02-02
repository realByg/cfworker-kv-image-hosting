export {}

declare global {
	const ENV: 'dev' | 'prod'
	const PASSWORD: string
	const USERNAME: string
	const TTL: string
	const DEDUPE: string
	const ImageKV: KVNamespace
	const __STATIC_CONTENT: KVNamespace
	const __STATIC_CONTENT_MANIFEST: string
}
