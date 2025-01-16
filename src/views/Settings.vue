<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-20 14:47:33
 * @LastEditTime: 2024-10-26 16:01:38
 * @LastEditors: sky
-->
<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/2">
            <Card class=" p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
                <template #header>
                    <label class="text-xl font-bold">账单图片解析</label>
                </template>
                <template #content>
                    <div class="flex flex-col gap-2">

                        <ToggleButton v-model="settings.screenshot_recognition" @click="saveSettings"
                            onIcon="pi pi-check" offIcon="pi pi-times" onLabel="启用" offLabel="关闭" />
                    </div>
                </template>

            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DB from '@/utils/db';

const settings = ref({
    screenshot_recognition: false
});

const saveSettings = async () => {
    await DB.saveSettings('screenshot_recognition', settings.value.screenshot_recognition);
};

async function initData() {
    const loadedSetting = await DB.loadSettings('screenshot_recognition');
    if (typeof loadedSetting === 'boolean') {
        settings.value.screenshot_recognition = loadedSetting;
    } else {
        console.warn('Invalid setting value, using default.');
    }
}

onMounted(() => {
    initData();
});
</script>

<style scoped></style>