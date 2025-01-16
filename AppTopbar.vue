<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-11-21 13:43:27
 * @LastEditors: sky
-->


<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import DB from '@/utils/db';
import Api from '@/api/server';
import { useCategoryListStoreHook } from '@/store/modules/categoryStore';
import { useRecordsStoreHook } from '@/store/modules/recordsStore';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import CryptoJS from 'crypto-js'
import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import batchDialog from '@/components/batchDialog.vue';


const route = useRoute();
const toast = useToast();

const categoryListStore = useCategoryListStoreHook();
const recordsStore = useRecordsStoreHook();


const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const fileUpload = ref(null);
const loading = ref(false);
const categoryList = ref([])
const categoryMap = ref({})

const waitImage = ref(null)  // 等待上传的图片

const screenshot_recognition = ref(true)

const dialog = ref({
    open: false,
    title: '',
    loading: false,
    form: {
        amount: 0,
        type: true

    },
});

const batchDialogData = ref({
    open: false,
    title: '账单批量识别',
    form: {
        platform: ""
    }
})

const resetForm = () => {
    dialog.value.form = {
        amount: 0,
        type: true
    };
};

async function onUpload(event) {

    const file = event.files[0];

    waitImage.value = file
    processImage(file);

    // if (file) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         processImage(e.target.result);
    //     };
    //     reader.readAsDataURL(file);
    // }

}

// 处理待上传的图片
async function processWaitImage() {
    const md5_image_name = CryptoJS.MD5(waitImage.value).toString()
    const image_path = `images/${md5_image_name}.${getFileExtension(waitImage.value.name)}`
    const arrayBuffer = await waitImage.value.arrayBuffer();
    const binaryData = new Uint8Array(arrayBuffer);
    await writeFile(image_path, binaryData, { baseDir: BaseDirectory.AppLocalData });
    dialog.value.form.image = image_path

}

function getFileExtension(fileName) {
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
}

async function setRecordsData() {
    try {
        const transactionsData = await DB.list(
            'transactions',
            null, // 查询条件
            'account_categories',         // 关联表
            'transactions.category_id = account_categories.category_id ORDER BY created_at DESC LIMIT 20 OFFSET 0' // 关联条件
        );
        recordsStore.setRecords(transactionsData)
    } catch (error) {
        console.error("Error parsing image:", error);
    }
}

const handleError = (error) => {
    console.error(error);
    openDialog('添加账单');
};

async function processImage(file) {
    loading.value = true;
    try {
        // 上传图片并获取响应
        console.log(file)
        const response = await Api.uploadImage(file);
        console.log(response,file)
        // 更新对话框表单数据
        dialog.value.form = {
            ...response,
            category_id: categoryMap.value.get(response.category)
        };

        openDialog('添加账单');
    } catch (error) {
        handleError(error);
    } finally {
        loading.value = false;
    }
}

function openDialog(title) {
    dialog.value.title = title;
    dialog.value.open = true;
}


function triggerFileUpload() {
    try {
        fileUpload.value.choose();
    } catch (error) {
        console.error("Error loading settings:", error);
        openDialog('添加账单');
    }
}



function upload() {
    batchDialogData.value.open = true
    // return toast.add({ severity: 'warn', summary: 'Warning', detail: '批量识别功能暂未开放', life: 3000 });
}

async function submit() {

    if (screenshot_recognition.value) {
        try {
            await processWaitImage()
        } catch (error) {
            return toast.add({ severity: 'error', summary: 'Error', detail: '图片上传失败', life: 3000 });
        }
    }

    if (!dialog.value.form.category_id) {
        return toast.add({ severity: 'warn', summary: 'Warning', detail: '请选择账单类型', life: 3000 });
    }
    // console.log(dialog.value.form)
    try {
        await DB.insert('transactions', dialog.value.form, ['category'])
    } catch (uploadError) {
        if (String(uploadError).includes('UNIQUE')) {
            toast.add({ severity: "error", summary: "Upload Error", detail: "请勿重复添加", life: 3000 });
            return
        }
        toast.add({ severity: "error", summary: "Upload Error", detail: "Failed to add file.", life: 3000 });
    }
    await setRecordsData()
    dialog.value.open = false;
    resetForm()

}

async function initData() {
    // 查询账单分类表
    const categoriesData = await DB.list(
        'account_categories',
    );
    categoryList.value = categoriesData
    categoryMap.value = new Map(categoryList.value.map(category => [category.name, category.category_id]));
    categoryListStore.setCategoryList(categoriesData)
    categoryListStore.setCategoryMap(categoryMap.value)
}

onMounted(async () => {
    screenshot_recognition.value = await DB.loadSettings('screenshot_recognition');
    initData()
});

watch(route, async () => {
    screenshot_recognition.value = await DB.loadSettings('screenshot_recognition');
});

</script>

<template>
    <BlockUI :blocked="loading" fullScreen />
    <batchDialog :dialog="batchDialogData" @initData="setRecordsData"></batchDialog>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <Image src="app-icon.png" alt="Image" width="60" />
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>

                <div class="relative">
                    <Button icon="pi pi-cloud-upload" v-tooltip.top="'账单导入'" rounded @click="upload()" />
                </div>

                <div class="relative" v-if="screenshot_recognition">
                    <Button v-tooltip.top="'添加账单'" icon="pi pi-plus" text raised rounded aria-label="Filter"
                        @click="triggerFileUpload" />
                    <FileUpload ref="fileUpload" mode="basic" name="demo[]" accept="image/*" customUpload :auto="true"
                        @select="onUpload" style="display: none;" />
                </div>

                <div class="relative" v-else>
                    <Button v-tooltip.top="'添加账单'" icon="pi pi-plus" text raised rounded aria-label="Filter"
                        @click="openDialog('添加账单')" />
                </div>
            </div>
        </div>
    </div>

    <Dialog :header="dialog.title" v-model:visible="dialog.open" :breakpoints="{ '960px': '75vw' }"
        :style="{ width: '45vw' }" :modal="true">
        <div class="card flex flex-col gap-6 w-full sm:w-auto">

            <div class="flex flex-col sm:flex-row sm:items-start gap-2">
                <label for="port" class="block font-semibold mb-1 sm:w-32">金额</label>
                <div class="flex flex-wrap gap-4 w-full">
                    <InputNumber v-model="dialog.form.amount" inputId="minmaxfraction" :minFractionDigits="2"
                        :maxFractionDigits="5" mode="currency" currency="USD" locale="en-US" fluid />
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start gap-2">
                <label for="protocol" class="block font-semibold mb-1 sm:w-32">类型</label>
                <div class="flex flex-wrap gap-4 w-full">
                    <ToggleButton v-model="dialog.form.type" onIcon="pi pi-minus" offIcon="pi pi-plus" onLabel="支出"
                        offLabel="收入" />
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start gap-2">
                <label for="hostname" class="block font-semibold mb-1 sm:w-32">账单分类</label>
                <div class="flex flex-wrap gap-4 w-full">
                    <Select v-model="dialog.form.category_id" :options="categoryList" optionLabel="name"
                        optionValue="category_id" placeholder="请选择账单类型" checkmark :highlightOnSelect="false"
                        class="w-full md:w-56" />
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start gap-2" v-if="dialog.form.ride_time">
                <label for="hostname" class="block font-semibold mb-1 sm:w-32">乘车时间</label>
                <div class="flex flex-wrap gap-4 w-full">
                    <Tag severity="success" :value="dialog.form.ride_time"></Tag>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start gap-2">
                <label for="remark" class="block font-semibold mb-1 sm:w-32">备注</label>
                <div class="flex flex-wrap gap-4 w-full">
                    <Textarea class="w-full" v-model="dialog.form.remark" autoResize rows="5" cols="30" />
                </div>
            </div>

        </div>

        <template #footer>
            <Button label="Save" :loading="dialog.loading" @click="submit" />
        </template>
    </Dialog>

    
</template>