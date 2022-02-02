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
					<font-awesome-icon
						v-if="props.mode === 'converted'"
						:icon="faTimesCircle"
						class="cursor-pointer"
						@click="emit('delete')"
					></font-awesome-icon>
				</div>
				<div class="text-xs text-gray-300">
					{{ formatBytes(props.size) }}
					<span v-if="props.uploadedAt">
						, {{ new Date(props.uploadedAt).toLocaleDateString() }}
					</span>
				</div>
			</div>
			<div v-if="props.mode === 'uploaded'">
				<el-divider class="m-0" />
				<div class="p-2 text-sm text-white">
					<div v-if="props.expiresAt">
						过期时间：{{ new Date(props.expiresAt).toLocaleString() }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import formatBytes from '../utils/format-bytes'
import { api as imageViewer } from 'v-viewer'
import { ElTooltip, ElDivider } from 'element-plus'

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
