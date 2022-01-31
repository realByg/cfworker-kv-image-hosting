import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/manage',
			component: () => import('../views/Manage.vue')
		},
		{
			path: '/upload',
			component: () => import('../views/Upload.vue')
		},
		{
			path: '/:path(.*)',
			redirect: '/manage'
		}
	]
})

export default router
