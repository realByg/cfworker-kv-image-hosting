export {}

declare global {
	const ENV: 'dev' | 'prod'
	const PASSWORD: string
	const USERNAME: string
	const KV: KVNamespace
}
