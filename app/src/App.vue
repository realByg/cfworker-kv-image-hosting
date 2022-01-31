<template>
	<ElConfigProvider :locale="zhCn">
		<div class="w-full h-screen overflow-x-hidden overflow-y-auto">
			<ElScrollbar>
				<div
					class="w-full h-16 bg-slate-200/50 shadow-sm sticky left-0 top-0 backdrop-blur-sm z-10"
				>
					<div class="mx-auto max-w-6xl px-4 h-full flex items-center">
						<img src="./assets/pic.png" class="w-8 h-8 block mr-2" />
						<div class="text-lg">KV 图床</div>

						<div class="flex-1"></div>

						<div
							:class="`${
								$route.path === '/upload' ? 'bg-slate-300' : ''
							} px-3 py-2 rounded-md  mr-2 text-gray-800 text-sm cursor-pointer`"
							@click="router.push('/upload')"
						>
							<font-awesome-icon :icon="faUpload"></font-awesome-icon>
							<span class="hidden md:inline-block ml-2">上传</span>
						</div>

						<div
							:class="`${
								$route.path === '/manage' ? 'bg-slate-300' : ''
							} px-3 py-2 rounded-md  mr-2 text-gray-800 text-sm cursor-pointer`"
							@click="router.push('/manage')"
						>
							<font-awesome-icon :icon="faCog"></font-awesome-icon>
							<span class="hidden md:inline-block ml-2">管理</span>
						</div>
					</div>
				</div>

				<div class="min-h-[calc(100vh-64px-64px)] overflow-auto">
					<router-view />
				</div>

				<div class="w-full h-16 flex items-center justify-center text-gray-500 text-sm">
					<a
						href="https://github.com/realByg/cfworker-kv-image-hosting"
						target="_blank"
						class="underline"
					>
						cfworker-kv-image-hosting
					</a>
				</div>
			</ElScrollbar>
		</div>
	</ElConfigProvider>
</template>

<script setup lang="ts">
import { faCog, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import { ElScrollbar, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const router = useRouter()
</script>
