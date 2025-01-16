<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import DB from '@/utils/db';
import CryptoJS from 'crypto-js'
import { readFile, remove, writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';

const route = useRoute();
const router = useRouter();
const records = ref(null);
const isEditingAmount = ref(false);
const isEditingRemark = ref(false);
const imageUrl = ref(null); // 新增一个变量来存储图片URL

const recordsList = ref([])

onMounted(() => {
    initData();
});

async function initData() {
    const records_id = route.params.records_id;
    try {
        const recordsData = await DB.list(
            'transactions',
            `records_id = ${records_id}`, // 查询条件
            'account_categories',         // 关联表
            'transactions.category_id = account_categories.category_id' // 关联条件
        );
        records.value = recordsData[0];
        recordsList.value = [{ label: '支付时间', value: recordsData[0].created_at }, { label: '收款方', value: recordsData[0].payee }, { label: '收款方全称', value: recordsData[0].recipient }, { label: '来源', value: recordsData[0].source }, { label: '支付方式', value: recordsData[0].payment_method }, { label: '乘车时间', value: recordsData[0].ride_time }]

        // 如果记录中有图片路径，读取并显示
        if (records.value.image) {
            imageUrl.value = await readerImage(records.value.image);
        }
    } catch (error) {
        console.error("Error parsing image:", error);
    }
}

function editAmount() {
    console.log(records.value)
    isEditingAmount.value = true;
}

function editRemark() {
    isEditingRemark.value = true;
}

function saveAmount() {
    isEditingAmount.value = false;
    DB.edit('transactions', { amount: records.value.amount }, `records_id = ${records.value.records_id}`);
}

function saveRemark() {
    isEditingRemark.value = false;
    DB.edit('transactions', { remark: records.value.remark }, `records_id = ${records.value.records_id}`);
}

function deleteRecord() {
    const records_id = route.params.records_id;
    DB.del('transactions', `records_id = ${records_id}`);
    router.push({ name: 'dashboard' });
}

function getFileExtension(fileName) {
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
}

async function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();
    // 删除原来的图片
    if (records.value.image) {
        await remove(records.value.image, { baseDir: BaseDirectory.AppLocalData });
    }

    // 重新写入新图片
    const md5_image_name = CryptoJS.MD5(file).toString()
    const image_path = `images/${md5_image_name}.${getFileExtension(file.name)}`
    const arrayBuffer = await file.arrayBuffer();
    const binaryData = new Uint8Array(arrayBuffer);
    await writeFile(image_path, binaryData, { baseDir: BaseDirectory.AppLocalData });
    // 修改表中的图片路径
    await DB.edit('transactions', { image: image_path }, `records_id = ${records.value.records_id}`);

    reader.onload = (e) => {
        imageUrl.value = e.target.result;
        console.log(records.value.image)
    };

    reader.readAsDataURL(file);
}

async function readerImage(image_path) {
    const contents = await readFile(image_path, { baseDir: BaseDirectory.AppLocalData });
    return uint8ArrayToBase64(contents);
}

function uint8ArrayToBase64(uint8Array) {
    const blob = new Blob([uint8Array], { type: 'image/png' });
    return URL.createObjectURL(blob);
}
</script>



<template>
    <Card v-if="records">
        <template #header>
            <div class="flex flex-col items-center mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-full" :class="records.bg_color"
                    style="width: 2.5rem; height: 2.5rem">
                    <font-awesome-icon :icon="['fas', records.icon]" :class="records.color + ' !text-xl'" />
                </div>
                <h2 class=" mt-2">{{ records.name }}</h2>
            </div>

            <div class="text-center text-3xl font-semibold mb-4"
                :class="{ 'text-red-500': records.type == 'true', 'text-green-500': records.type == 'false' }">
                <span v-if="!isEditingAmount">{{ records.amount }}</span>
                <InputNumber v-if="isEditingAmount" v-model="records.amount" inputId="currency-us" mode="currency"
                    currency="USD" locale="en-US" @blur="saveAmount" />
                <i v-if="!isEditingAmount" class="pi pi-pencil text-gray-400 ml-1 cursor-pointer"
                    @click="editAmount"></i>
            </div>
        </template>

        <template #content>
            <!-- Details Section -->
            <!-- <Divider /> -->
            <div class="flex justify-between mb-4" v-for="item in recordsList" :key="item.label">
                <template v-if="item.value">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ item.label
                            }}</span>
                    </div>
                    <div class="flex items-center justify-center  text-muted-color ">
                        {{ item.value }}
                    </div>
                </template>

            </div>
            <div class="flex justify-between mb-4">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">备注</span>
                </div>
                <div class="flex items-center justify-center  text-muted-color ">
                    <div v-if="!isEditingRemark" class="flex items-center">
                        <span class="block w-20 overflow-hidden text-ellipsis whitespace-nowrap mr-1">{{
                            records.remark
                            }}</span>
                        <i class="pi pi-pencil text-gray-400 cursor-pointer" @click="editRemark"></i>
                    </div>
                    <Textarea v-if="isEditingRemark" class="text-left" @blur="saveRemark(records.remark)"
                        v-model="records.remark" autoResize rows="2" cols="20" />
                </div>
            </div>

            <!-- Photo Section -->
            <div class="card flex flex-col items-center gap-6">
                <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                    class="p-button-outlined" chooseLabel="上传" chooseIcon="pi pi-camera" />
                <Image v-if="imageUrl" :src="imageUrl" alt="Image" class="shadow-md rounded-xl w-full sm:w-64"
                    style="filter: grayscale(100%)" preview />
            </div>

        </template>

        <template #footer>
            <div class="flex justify-between">
                <Button label="删除" class="w-full" severity="danger" @click="deleteRecord" />
            </div>
        </template>


    </Card>

</template>