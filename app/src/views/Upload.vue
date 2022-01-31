<template>
	<div class="mx-auto max-w-6xl my-4 px-4">
		<div class="text-gray-800 text-lg">上传图片</div>
		<div class="mb-4 text-sm text-gray-500">
			每张图片大小不超过 {{ formatBytes(imgSizeLimit) }}
		</div>

		<div class="border-2 border-dashed border-slate-400 rounded-md relative">
			<loading-overlay :loading="loading" />

			<div class="grid p-4 gap-4 grid-cols-3" @drop.prevent="onFileDrop" @dragover.prevent>
				<div v-if="imgList.length === 0" class="col-span-3">
					<div class="h-[240px] w-full flex items-center justify-center">
						<div class="text-gray-500">
							<font-awesome-icon :icon="faCopy"></font-awesome-icon>
							粘贴或拖动图片至此处
						</div>
					</div>
				</div>

				<div class="col-span-3 md:col-span-1" v-for="img in imgList" :key="img.id">
					<div class="w-full bg-slate-200 rounded-md shadow-sm overflow-hidden relative">
						<img
							class="block w-full h-60 object-cover cursor-zoom-in"
							:src="img.dataURL"
							@click="viewImg(img.id)"
						/>
						<div
							class="w-full p-2 absolute left-0 bottom-0 bg-slate-800/50 backdrop-blur-sm"
						>
							<div class="w-full flex items-center">
								<div class="flex-1 w-full truncate text-white">
									<el-tooltip :content="img.name" placement="top-start">
										{{ img.name }}
									</el-tooltip>
								</div>
								<font-awesome-icon
									:icon="faTimesCircle"
									class="text-red-500 cursor-pointer"
									@click="removeImg(img.id)"
								></font-awesome-icon>
							</div>
							<div class="text-xs text-gray-300">
								{{ formatBytes(img.dataURL.length) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="imgList.length" class="w-full mt-4 flex items-center text-sm text-gray-500">
			<el-checkbox class="h-6" v-model="imgsHasExpiration" size="large" label="过期删除" />
			<el-date-picker
				v-if="imgsHasExpiration"
				v-model="imgsExpireAt"
				popper-class="remove-now-btn"
				size="small"
				class="ml-2"
				type="datetime"
				placeholder="选择过期时间"
				:disabled-date="(date: Date) => date < new Date()"
			/>
		</div>

		<div class="w-full rounded-md shadow-sm overflow-hidden mt-4 grid grid-cols-8">
			<div class="md:col-span-1 col-span-8" @click="input?.click()">
				<div
					class="w-full h-10 bg-blue-500 cursor-pointer flex items-center justify-center text-white"
				>
					<font-awesome-icon :icon="faImages" class="mr-2"></font-awesome-icon>
					选择图片
				</div>
			</div>

			<div class="md:col-span-5 col-span-8">
				<div
					class="w-full h-10 bg-slate-200 flex items-center md:pl-4 justify-center md:justify-start"
				>
					已选择 {{ imgList.length }} 张，共 {{ formatBytes(imgTotalSize) }}
				</div>
			</div>

			<div class="md:col-span-1 col-span-3">
				<div
					:class="`${
						imgList.length
							? 'cursor-pointer bg-red-500'
							: 'cursor-not-allowed bg-red-300 active:pointer-events-none'
					} w-full h-10 flex items-center justify-center text-white`"
					@click="imgList = []"
				>
					<font-awesome-icon :icon="faTrashAlt" class="mr-2"></font-awesome-icon>
					清除
				</div>
			</div>

			<div class="md:col-span-1 col-span-5">
				<div
					:class="`${
						imgList.length
							? 'bg-green-500 cursor-pointer'
							: 'bg-green-300 cursor-not-allowed active:pointer-events-none'
					} w-full h-10 flex items-center justify-center text-white`"
					@click="uploadImgs"
				>
					<font-awesome-icon :icon="faUpload" class="mr-2"></font-awesome-icon>
					上传
				</div>
			</div>
		</div>
	</div>

	<input
		ref="input"
		type="file"
		accept="image/*"
		class="hidden"
		multiple
		@change="onInputChange"
	/>
</template>

<script setup lang="ts">
import { faImages, faTrashAlt, faCopy, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ConvertedImg } from '../utils/types'
import { MD5 } from 'crypto-js'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import { formatBytes } from '../utils/format-bytes'
import { ElNotification, ElTooltip, ElCheckbox, ElDatePicker } from 'element-plus'
import { api as imgViewer } from 'v-viewer'

const imgSizeLimit = 20 * 1024 * 1024
const input = ref<HTMLInputElement>()
const imgList = ref<ConvertedImg[]>([])
const loading = ref(false)
const imgTotalSize = computed(() => imgList.value.reduce((a, i) => a + i.dataURL.length, 0))
const imgsHasExpiration = ref(false)
const imgsExpireAt = ref('')

watch(
	() => imgsExpireAt.value,
	() => {
		imgList.value = imgList.value.map((img) => ({
			...img,
			expiresAt: new Date(imgsExpireAt.value).getTime()
		}))
	}
)

const onInputChange = () => {
	addToImgList(input.value?.files)
}
const onFileDrop = (e: DragEvent) => {
	addToImgList(e.dataTransfer?.files)
}
const onPaste = (e: ClipboardEvent) => {
	addToImgList(e.clipboardData?.files)
}

onMounted(() => {
	document.onpaste = onPaste
})

onUnmounted(() => {
	document.onpaste = null
})

const viewImg = (imgID: string) => {
	imgViewer({
		images: imgList.value.map((img) => img.dataURL),
		options: {
			initialViewIndex: imgList.value.findIndex((img) => img.id === imgID)
		}
	})
}

const removeImg = (imgID: string) => {
	imgList.value = imgList.value.filter((img) => img.id !== imgID)
}

const addToImgList = async (files: FileList | null | undefined) => {
	if (!files) return

	loading.value = true
	for (let i = 0; i < files.length; i++) {
		const file = files.item(i)
		if (!file) return
		if (file.size > imgSizeLimit) {
			ElNotification({
				message: `${file.name} 文件过大`,
				type: 'error'
			})
			continue
		}

		const fileDataURL = await fileToDataURL(file)
		if (!fileDataURL.startsWith('data:image/')) {
			ElNotification({
				message: `${file.name} 不是图片文件`,
				type: 'error'
			})
			continue
		}

		const imgID = MD5(fileDataURL).toString()
		const imgType = fileDataURL.match(/data:(image\/.*);base64/)?.[1] || 'image/jpeg'
		const imgExists = imgList.value.some((img) => img.id === imgID)
		if (imgExists) continue

		imgList.value = [
			...imgList.value,
			{
				id: imgID,
				name: file.name,
				type: imgType,
				modifiedAt: file.lastModified,
				dataURL: fileDataURL
			}
		]
	}
	loading.value = false
}

const fileToDataURL = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.readAsDataURL(file)
		fileReader.onloadend = () => {
			const fileDataURL = String(fileReader.result)
			resolve(fileDataURL)
		}
		fileReader.onerror = (e) => {
			reject(e)
		}
	})

const uploadImgs = () => {
	console.log(imgList.value.length)
}
</script>

<style>
.remove-now-btn .el-picker-panel__footer button:first-child {
	display: none;
}
</style>
