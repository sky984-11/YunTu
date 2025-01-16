<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-27 13:55:14
 * @LastEditTime: 2024-11-14 08:48:15
 * @LastEditors: sky
-->
<template>
    <Dialog v-model:visible="dialog.open" modal >
        <template #container="{ closeCallback }">
            <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl">
                <Image src="app-icon.png" alt="Image" class="block mx-auto" width="60" />

                <!-- 更新版本和更新日志 -->
                <div class="text-center ">
                    <h2 class="text-xl font-bold">版本 {{ dialog.version }}</h2>
                    <ul class="text-left list-disc pl-5 mt-2 space-y-2 ">
                        <li v-for="(log, index) in dialog.updateLogs" :key="index">{{ log }}</li>
                    </ul>
                </div>
                
                <div class="flex items-center gap-4">
                    <Button label="更新" @click="toUpdate" text class="!p-4 w-full "></Button>
                    <Button v-if="!dialog.forceUpdate" label="关闭" @click="closeCallback" text class="!p-4 w-full "></Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref } from "vue";

import { open } from '@tauri-apps/plugin-shell';


const props = defineProps({
    dialog: { type: Object }
})

async function toUpdate() {
    // opens the given URL on the default browser:
    await open(props.dialog.link);
}

</script>
