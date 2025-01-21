<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-11-08 16:45:24
 * @LastEditors: sky
-->
<script setup>
import { onMounted, ref } from "vue";
import UpdateDialog from "./views/UpdateDialog.vue"
import { getVersion } from '@tauri-apps/api/app';
import Api from '@/api/server';

const dialog = ref({
    open: false,
})

async function initData() {
    const appVersion = await getVersion();
     Api.getClientIp()
     Api.update().then(res=>{
        if(res.version != appVersion){
            dialog.value = res
            dialog.value.open = true
        }
    })

}

onMounted(() => initData())
</script>

<template>
    <router-view />
    <update-dialog v-if="dialog.open" :dialog="dialog"></update-dialog>
</template>

<style scoped></style>
