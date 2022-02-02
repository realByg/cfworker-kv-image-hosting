<template>
	<div class="mx-auto max-w-6xl my-4 px-4">
		<div class="text-gray-800 text-lg">上传图片</div>
		<div class="mb-4 text-sm text-gray-500">
			每张图片大小不超过 {{ formatBytes(imageSizeLimit) }}
		</div>

		<div class="border-2 border-dashed border-slate-400 rounded-md relative">
			<loading-overlay :loading="loading" />

			<div
				class="grid p-4 gap-4 grid-cols-3 min-h-[240px]"
				@drop.prevent="onFileDrop"
				@dragover.prevent
			>
				<div
					v-if="convertedImages.length === 0"
					class="absolute -z-10 left-0 top-0 w-full h-full flex items-center justify-center"
				>
					<div class="text-gray-500">
						<font-awesome-icon :icon="faCopy"></font-awesome-icon>
						粘贴或拖动图片至此处
					</div>
				</div>

				<transition-group name="el-fade-in-linear">
					<div
						class="col-span-3 md:col-span-1"
						v-for="item in convertedImages"
						:key="item.id"
					>
						<image-box
							:src="item.tmpSrc"
							:size="item.dataURL.length"
							:name="item.name"
							@delete="removeImage(item.id, item.tmpSrc)"
							mode="converted"
						/>
					</div>
				</transition-group>
			</div>
		</div>

		<transition name="el-zoom-in-top">
			<div
				v-if="convertedImages.length"
				class="w-full mt-4 flex items-center text-sm text-gray-500"
			>
				<el-checkbox
					class="h-6"
					:class="{
						'area-disabled': loading
					}"
					v-model="imagesHaveExpiration"
					size="large"
					label="过期删除"
				/>
				<el-date-picker
					v-if="imagesHaveExpiration"
					:disabled="loading"
					v-model="imagesExpiration"
					popper-class="remove-now-btn"
					size="small"
					class="ml-2"
					type="datetime"
					placeholder="选择过期时间"
					:disabled-date="(date: Date) => date < new Date()"
				/>
			</div>
		</transition>

		<div class="w-full rounded-md shadow-sm overflow-hidden mt-4 grid grid-cols-8">
			<div class="md:col-span-1 col-span-8">
				<div
					class="w-full h-10 bg-blue-500 cursor-pointer flex items-center justify-center text-white"
					:class="{
						'area-disabled': loading
					}"
					@click="input?.click()"
				>
					<font-awesome-icon :icon="faImages" class="mr-2"></font-awesome-icon>
					选择图片
				</div>
			</div>

			<div class="md:col-span-5 col-span-8">
				<div
					class="w-full h-10 bg-slate-200 flex items-center md:pl-4 justify-center md:justify-start"
				>
					已选择 {{ convertedImages.length }} 张，共 {{ formatBytes(imagesTotalSize) }}
				</div>
			</div>

			<div class="md:col-span-1 col-span-3">
				<div
					class="w-full bg-red-500 cursor-pointer h-10 flex items-center justify-center text-white"
					:class="{
						'area-disabled': convertedImages.length === 0 || loading
					}"
					@click="convertedImages = []"
				>
					<font-awesome-icon :icon="faTrashAlt" class="mr-2"></font-awesome-icon>
					清除
				</div>
			</div>

			<div class="md:col-span-1 col-span-5">
				<div
					class="w-full h-10 flex items-center justify-center text-white bg-green-500 cursor-pointer"
					:class="{
						'area-disabled': convertedImages.length === 0 || loading
					}"
					@click="uploadImages"
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
import { faImages, faTrashAlt, faCopy } from '@fortawesome/free-regular-svg-icons'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import formatBytes from '../utils/format-bytes'
import { ElNotification as elNotify, ElCheckbox, ElDatePicker } from 'element-plus'
import { requestUploadImages } from '../utils/request'
import { useRouter } from 'vue-router'
import ImageBox from '../components/ImageBox.vue'
import { blobToDataURL } from 'blob-util'
import { MD5 } from 'crypto-js'
import type { ConvertedImage } from '../utils/types'

const convertedImages = ref<ConvertedImage[]>([])
const imagesTotalSize = computed(() =>
	convertedImages.value.reduce((total, item) => total + item.dataURL.length, 0)
)
const imagesHaveExpiration = ref(false)
const imagesExpiration = ref(new Date(new Date().setHours(new Date().getHours() + 24)))
const imageSizeLimit = 20 * 1024 * 1024
const input = ref<HTMLInputElement>()
const loading = ref(false)
const router = useRouter()

watchEffect(() => {
	if (imagesHaveExpiration.value) {
		convertedImages.value = convertedImages.value.map((item) => ({
			...item,
			expiresAt: imagesExpiration.value.getTime()
		}))
	}
})

const onInputChange = () => {
	appendConvertedImages(input.value?.files)
}
const onFileDrop = (e: DragEvent) => {
	appendConvertedImages(e.dataTransfer?.files)
}
const onPaste = (e: ClipboardEvent) => {
	appendConvertedImages(e.clipboardData?.files)
}

onMounted(() => {
	document.onpaste = onPaste
})

onUnmounted(() => {
	document.onpaste = null
	convertedImages.value.forEach((item) => URL.revokeObjectURL(item.tmpSrc))
})

const appendConvertedImages = async (files: FileList | null | undefined) => {
	if (!files) return

	loading.value = true
	for (let i = 0; i < files.length; i++) {
		const file = files.item(i)
		if (!file) return
		if (file.size > imageSizeLimit) {
			elNotify({
				message: `${file.name} 文件过大`,
				type: 'error'
			})
			continue
		}

		if (!file.type.startsWith('image/')) {
			elNotify({
				message: `${file.name} 不是图片文件`,
				type: 'error'
			})
			continue
		}

		const dataURL = await blobToDataURL(file)
		const id = MD5(dataURL).toString().slice(0, 8)
		convertedImages.value = [
			...convertedImages.value,
			{
				id,
				name: file.name,
				dataURL,
				tmpSrc: URL.createObjectURL(file),
				expiresAt: 0
			}
		]
	}
	loading.value = false
}

const removeImage = (id: string, src: string) => {
	convertedImages.value = convertedImages.value.filter((item) => item.id !== id)
	URL.revokeObjectURL(src)
}

const uploadImages = () => {
	loading.value = true

	requestUploadImages(convertedImages.value)
		.then(() => {
			elNotify({
				title: '上传完成',
				message: `共 ${convertedImages.value.length} 张图片，${formatBytes(
					imagesTotalSize.value
				)}`,
				type: 'success'
			})
			convertedImages.value = []
			router.push('/')
		})
		.catch(() => {})
		.finally(() => {
			loading.value = false
		})
}
</script>

<style>
.remove-now-btn .el-picker-panel__footer button:first-child {
	display: none;
}
</style>
