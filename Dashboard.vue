<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-11-05 13:50:49
 * @LastEditors: sky
-->
<script setup>
import { onMounted, ref, watch,onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import DB from '@/utils/db';
import { useRecordsStoreHook } from '@/store/modules/recordsStore';

const recordsStore = useRecordsStoreHook();
const router = useRouter();

const records = ref([]);
const page = ref(1);          // 当前页码
const limit = 20;             // 每次加载的记录数
const loading = ref(false);   // 数据加载状态
const allLoaded = ref(false); // 是否所有数据已加载完毕

onMounted(() => {
    initData();
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
});

watch(() => recordsStore.records, () => {
    // console.log(recordsStore.records)
    records.value = recordsStore.records;
});

async function initData() {
    if (loading.value || allLoaded.value) return; // 防止重复加载

    loading.value = true;
    try {
        const transactionsData = await DB.list(
            'transactions',
            null, // 查询条件
            'account_categories', // 关联表
            `transactions.category_id = account_categories.category_id ORDER BY created_at DESC LIMIT ${limit} OFFSET ${(page.value - 1) * limit}`
        );     
        // console.log(transactionsData)
        if (transactionsData.length < limit) {
            allLoaded.value = true; // 数据加载完毕
        }
        records.value = [...records.value, ...transactionsData]; // 追加新数据
        // console.log(records.value)
        page.value++;
    } catch (error) {
        console.error("Error loading data:", error);
    } finally {
        loading.value = false;
    }
}

function handleScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 当用户滚动到底部时加载更多数据
    if (scrollTop + windowHeight >= documentHeight - 10 && !loading.value) {
        initData();
    }
}

function toDetails(record) {
    router.push({ name: 'details', params: { records_id: record.records_id } });
}

onBeforeUnmount(() => {
    // 移除滚动监听器
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div v-if="records.length === 0" class="col-span-12 text-center py-8 text-gray-400">
            暂无账单数据
        </div>
        <div v-for="record in records" :key="record.records_id" class="col-span-12 lg:col-span-6 xl:col-span-3" @click="toDetails(record)">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span v-if="record.payee" class="block text-muted-color font-medium mb-4">{{ record.payee }}</span>
                        <div class="font-medium text-xl" :class="{ 'text-red-500': record.type == 'true', 'text-green-500': record.type == 'false' }">
                            {{ record.amount }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center" v-tooltip.top="record.name" :class="record.bg_color" style="width: 2.5rem; height: 2.5rem">
                        <font-awesome-icon :icon="['fas', record.icon]" :class=" record.color + ' !text-xl'"/>
                    </div>
                </div>
                <span class="font-medium text-muted-color">{{ record.created_at }}</span>
            </div>
        </div>
        <div v-if="loading" class="col-span-12 text-center py-8">
            正在加载更多数据...
        </div>
    </div>
</template>
