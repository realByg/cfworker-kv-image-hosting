<template>
	<div
		class="absolute left-0 top-0 w-full h-screen backdrop-blur-sm z-50 flex items-center justify-center p-4"
	>
		<div class="max-w-md bg-white rounded-md shadow-sm w-full relative">
			<loading-overlay :loading="loading" />

			<div class="m-4">
				<div class="flex items-center">
					<img src="../assets/pic.png" class="w-6 h-6 block mr-2" />
					<div>{{ appName }}</div>
					<div class="flex-1"></div>
					<a :href="repoLink" target="_blank">
						<font-awesome-icon :icon="faGithub"></font-awesome-icon>
					</a>
				</div>
				<div class="text-sm text-gray-500">请登录</div>
			</div>

			<el-form class="mx-4 mb-6">
				<el-form-item>
					<el-input v-model="username" placeholder="用户名" clearable autofocus>
						<template #prepend>
							<font-awesome-icon :icon="faUser"></font-awesome-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="password" placeholder="密码" show-password>
						<template #prepend>
							<font-awesome-icon :icon="faLock"></font-awesome-icon>
						</template>
					</el-input>
				</el-form-item>
				<div
					:class="`${
						username && password
							? 'bg-blue-500 cursor-pointer'
							: 'bg-blue-300 cursor-not-allowed active:pointer-events-none'
					} w-full h-8 rounded-md text-white text-center leading-8`"
					@click="doLogin"
				>
					确定
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElInput, ElForm, ElFormItem } from 'element-plus'
import { ref } from 'vue'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { repoLink, appName } from '../utils/vars'
import LoadingOverlay from './LoadingOverlay.vue'
import { useStore } from 'vuex'
import { apiLogin } from '../utils/apis'
import { setBasicToken, removeBasicToken } from '../utils/local-storage'

const username = ref('')
const password = ref('')
const loading = ref(false)
const store = useStore()

const doLogin = () => {
	loading.value = true

	const basicToken = btoa(`${username.value}:${password.value}`)
	setBasicToken(basicToken)

	apiLogin()
		.then(() => {
			store.commit('setLoginAreaVisible', false)
		})
		.catch(() => {
			removeBasicToken()
		})
		.finally(() => {
			loading.value = false
		})
}
</script>
