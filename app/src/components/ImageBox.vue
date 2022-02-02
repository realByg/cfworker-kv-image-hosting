<template>
	<div class="w-full bg-slate-200 rounded-md shadow-sm overflow-hidden relative">
		<img
			class="block w-full h-80 object-cover cursor-zoom-in"
			:src="props.src"
			@click="viewImage"
		/>
		<div class="w-full absolute left-0 bottom-0 bg-slate-800/70 backdrop-blur-sm">
			<div class="p-2">
				<div class="w-full flex items-center text-white">
					<div class="flex-1 w-full truncate">
						<el-tooltip :content="props.name" placement="top-start">
							{{ props.name }}
						</el-tooltip>
					</div>
					<div
						v-if="props.mode === 'converted'"
						class="w-6 h-6 flex items-center justify-center cursor-pointer"
						@click="emit('delete')"
					>
						<font-awesome-icon :icon="faTimesCircle" />
					</div>
				</div>
				<span class="text-xs text-gray-300 flex items-center">
					{{ formatBytes(props.size) }}
					<el-divider v-if="props.uploadedAt" direction="vertical" />
					<span v-if="props.uploadedAt">
						{{ new Date(props.uploadedAt).toLocaleDateString() }}
					</span>
					<el-divider v-if="props.expiresAt" direction="vertical" />
					<span v-if="props.expiresAt">
						<font-awesome-icon :icon="faTrashAlt" />
						{{ new Date(props.expiresAt).toLocaleString() }}
					</span>
				</span>
			</div>
			<div v-if="props.mode === 'uploaded'">
				<el-divider class="m-0" />
				<div class="w-full flex text-white h-10 text-center text-sm">
					<div class="flex-1 flex items-center justify-center cursor-pointer">
						<font-awesome-icon :icon="faDownload" class="mr-2" />
						下载
					</div>
					<el-divider direction="vertical" class="h-full" />
					<div class="flex-1 flex items-center justify-center cursor-pointer">
						<font-awesome-icon :icon="faCopy" class="mr-2" />
						链接
					</div>
					<el-divider direction="vertical" class="h-full" />
					<el-popconfirm
						title="确认删除图片吗？"
						confirm-button-type="danger"
						@confirm="
							() => {
								// (e: Event) => boolean ???
								emit('delete')
								return true
							}
						"
					>
						<template #reference>
							<div class="flex-1 flex items-center justify-center cursor-pointer">
								<font-awesome-icon :icon="faTrashAlt" class="mr-2" />
								删除
							</div>
						</template>
					</el-popconfirm>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { faTimesCircle, faTrashAlt, faCopy } from '@fortawesome/free-regular-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import formatBytes from '../utils/format-bytes'
import { api as imageViewer } from 'v-viewer'
import { ElTooltip, ElDivider, ElPopconfirm } from 'element-plus'

const props = defineProps<{
	src: string
	name: string
	size: number
	mode: 'converted' | 'uploaded'
	uploadedAt?: number
	expiresAt?: number
}>()
const emit = defineEmits(['delete'])

const viewImage = () => {
	imageViewer({
		images: [props.src],
		options: {
			navbar: false,
			toolbar: false
		}
	})
}
</script>
