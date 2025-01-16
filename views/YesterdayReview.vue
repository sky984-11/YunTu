<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-20 09:28:40
 * @LastEditTime: 2024-11-15 08:47:11
 * @LastEditors: sky
-->

<template>
  <div class="card flex justify-center">
    <FloatLabel variant="in">
      <DatePicker v-model="date" inputId="on_label" dateFormat="yy-mm-dd" showIcon iconDisplay="input"
        @update:modelValue="initData" />
      <label for="on_label" class="font-bold">回顾时间</label>
    </FloatLabel>
  </div>

  <div v-if="events.length === 0" class="col-span-12 text-center py-8 text-gray-400">
    暂无该日数据
  </div>
  <div class="card">
    <!-- <template #content> -->
      <Timeline :value="events" class="customized-timeline">
        <template #opposite="slotProps">
          <small class="text-surface-500 dark:text-surface-400">{{ slotProps.item.date }}</small>
        </template>
        <template #marker="slotProps">
          <span class="flex w-8 h-8 items-center justify-center rounded-full z-10 shadow-sm"
            :class="slotProps.item.bg_color">
            <font-awesome-icon :icon="['fas', slotProps.item.icon]" :class="slotProps.item.color + ' !text-xl'" />
          </span>
        </template>
        <template #content="slotProps" >
          <p class="break-word">{{ slotProps.item.status }}</p>
              
        </template>
      </Timeline>
    <!-- </template> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DB from '@/utils/db';

// 计算昨天的日期
const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 时间格式化方法（时:分:秒）
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const date = ref(getYesterday());
const events = ref([]);

async function initData() {
  let data = []

  try {
    const transactionsData = await DB.getTransactionsByDate(formatDate(date.value));
    for (let item of transactionsData) {
      const remark = item.remark ? `，备注：${String(item.remark)}` : ''
      const payee = item.payee ? `在${item.payee}` : '';
 
        data.push({
          status: `${payee}消费${item.amount}元${remark}`,
          date: formatTime(item.created_at),
          icon: item.icon,
          color: item.color,
          bg_color: item.bg_color
        })

    }
    events.value = data
    console.log(events.value)


  } catch (error) {
    console.error("Error loading data:", error);
  }
}

onMounted(() => {
  // 初始化数据
  initData()
})

</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.customized-timeline) {
        .p-timeline-event:nth-child(even) {
            flex-direction: row;

            .p-timeline-event-content {
                text-align: left;
            }
        }

        .p-timeline-event-opposite {
            flex: 0;
        }
    }
}

.break-word {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>