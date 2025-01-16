<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-20 09:28:40
 * @LastEditTime: 2024-11-20 13:56:58
 * @LastEditors: sky
-->

<template>
    <Card>
        <template #content>
            <Textarea  variant="filled"  v-model="suggestions" placeholder="bug或者功能建议，可以在这里进行反馈" autoResize rows="10"
            cols="30"  class="w-full"   />
        </template>
        <template #footer>
            <Button class="!p-4 w-full" type="submit" severity="secondary" @click="submit" label="提交" />
    </template>
       
    </Card>
</template>

<script setup>
import { ref } from "vue";
import Api from '@/api/server';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const suggestions = ref('');
async function submit(){
    if(suggestions.value == ''){
        return toast.add({ severity: 'warn', summary: 'Warn Message', detail: '请先填写反馈信息', life: 3000 });
    }
    const data = await Api.suggestions(suggestions.value)
    console.log(data)
    if(data.code == 200){
        suggestions.value = ''
        return toast.add({ severity: 'success', summary: 'Success Message', detail: data.msg, life: 3000 });
    }
}

</script>
