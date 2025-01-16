<!--
 * @Description: 批量导入
 * @Author: sky
 * @Date: 2024-10-27 13:55:14
 * @LastEditTime: 2024-11-15 17:35:23
 * @LastEditors: sky
 1. 支付宝和微信导入都需要对文件名进行校验，必须先选则平台才允许上传
-->
<template>
    <Toast />
    <Dialog v-model:visible="dialog.open" modal>
        <template #container="{ closeCallback }">
            <div class="flex flex-col px-8 py-8 gap-3 rounded-2xl">
                <!-- <Image src="app-icon.png" alt="Image" class="block mx-auto" width="60" /> -->
                
                <div>
                    <FileUpload name="demo[]" :fileLimit="1" accept=".zip" :maxFileSize="1000000">

                        <template #header="{ chooseCallback, clearCallback, files }">
                            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                <div class="flex gap-2">
                                    <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined
                                        severity="secondary"></Button>
                                    <Button @click="uploadEvent(files)" icon="pi pi-cloud-upload" rounded outlined
                                        severity="success" :disabled="!files || files.length === 0"></Button>
                                    <Button @click="clearCallback()" icon="pi pi-times" rounded outlined
                                        severity="danger" :disabled="!files || files.length === 0"></Button>
                                </div>
                                <ProgressBar :value="totalSizePercent" class="md:w-20rem h-1 w-full md:ml-auto">
                                </ProgressBar>
                            </div>
                        </template>

                        <template
                            #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback, messages }">
                            <div class="flex flex-col gap-8 pt-4">
                                <Message v-for="message of messages" :key="message"
                                    :class="{ 'mb-8': !files.length && !uploadedFiles.length }" severity="error">
                                    {{ message }}
                                </Message>

                                <div v-if="files.length > 0">

                                    <div class="flex justify-center">
                                        <InputOtp v-model="filePassword" integerOnly :length="6" />
                                    </div>
                                    <div class="flex flex-wrap gap-4 my-4">
                                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                            class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">

                                            <span
                                                class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                    file.name }}</span>
                                            <div>{{ formatSize(file.size) }}</div>
                                            <Badge value="Pending" severity="warn" />
                                            <Button icon="pi pi-times"
                                                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                                outlined rounded severity="danger" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="uploadedFiles.length > 0">
                                    <h5>Completed</h5>
                                    <div class="flex flex-wrap gap-4">
                                        <div v-for="(file, index) of uploadedFiles"
                                            :key="file.name + file.type + file.size"
                                            class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                            <span
                                                class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                    file.name }}</span>
                                            <div>{{ formatSize(file.size) }}</div>
                                            <Badge value="Completed" class="mt-4" severity="success" />
                                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)"
                                                outlined rounded severity="danger" />
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </template>

                        <template #empty>
                            <div class="flex items-center justify-center flex-col">
                                <i
                                    class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                                <p class="mt-6 mb-0">支持支付宝和微信账单导入,导入流程参考帮助界面</p>
                            </div>
                        </template>
                    </FileUpload>
                </div>
                <div class="flex items-center gap-4">
                    <Button label="关闭" @click="closeCallback" text class="!p-4 w-full "></Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";
import Api from '@/api/server';
import DB from '@/utils/db';

const props = defineProps({
    dialog: { type: Object }
})

const uploadLoading = ref(false)

const totalSizePercent = ref(0);

const filePassword = ref('');


const $primevue = usePrimeVue();
const toast = useToast();

const emits = defineEmits(["initData"]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
};

const uploadEvent = async (file) => {
    uploadLoading.value = true;
    totalSizePercent.value = 0
    if(filePassword.value == ''){
        return toast.add({ severity: 'warn', summary: 'Warning', detail: '请输入文件解压密码', life: 3000 });
    }
    try {
        const res = await Api.batchUpload(file[0], filePassword.value);

        if (res.code === 200) {
            const totalItems = res.data.length;
            for (const [index, item] of res.data.entries()) {
                await DB.insert('transactions', item, ['status']);

                totalSizePercent.value = Math.round(((index + 1) / totalItems) * 100);
            }

            emits("initData");
            toast.add({ severity: "success", summary: "Success", detail: "File Uploaded", life: 3000 });
        } else {
            toast.add({ severity: "warn", summary: "Upload Warning", detail: res.msg, life: 3000 });
        }
    } catch (uploadError) {
        if (String(uploadError).includes('UNIQUE')) {
            toast.add({ severity: "error", summary: "Upload Error", detail: "请勿重复上传", life: 3000 });
            return
        }
        toast.add({ severity: "error", summary: "Upload Error", detail: String(uploadError), life: 3000 });
    } finally {
        uploadLoading.value = false;
    }
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

</script>
