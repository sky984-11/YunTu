<script setup>
import { onMounted, ref, computed } from 'vue';
import DB from '@/utils/db';
import { startOfMonth } from 'date-fns';

const lineData = ref(null);
const pieData = ref(null);
const lineOptions = ref(null);
const pieOptions = ref(null);

const changeTime = ref({
    title: '月选择器',  // 或者自定义
    isMonthPicker: true,
    MonthDate: startOfMonth(new Date()),
    dateStr: '', // 自定义时间字符串
    options: ['上周', '上月', '近一年']
});

const totalIncome = ref(0);
const totalExpenses = ref(0);

onMounted(async () => {
    setColorOptions();
    await initData();
    genYear();
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    pieData.value = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            },
        }
    };

    lineData.value = {
        labels: [],
        datasets: [
            {
                label: '收入',
                data: [],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4,
                pointRadius: 1
            },
            {
                label: '支出',
                data: [],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-red-500'),
                borderColor: documentStyle.getPropertyValue('--p-red-500'),
                tension: 0.4,
                pointRadius: 1
            }
        ]
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

function toggle() {
    changeTime.value.isMonthPicker = !changeTime.value.isMonthPicker;
    changeTime.value.title = changeTime.value.isMonthPicker ? '月选择器' : '自定义';
}

// 修改月时间
function changeMonthDate(date) {
    changeTime.value.MonthDate = startOfMonth(date);
    initData();
}

// 修改自定义时间
function changeYearDate(year) {
    changeTime.value.dateStr = year;
    initData();
}

const setLineChartData = (dates, income, expenses) => {
    lineData.value.labels = dates;
    lineData.value.datasets[0].data = income;
    lineData.value.datasets[1].data = expenses;
};

const setPieChartData = (labels, data) => {
    pieData.value.labels = labels;
    pieData.value.datasets[0].data = data;
};

const initData = async () => {
    const type = changeTime.value.isMonthPicker ? 'month' : 'year';
    const date = changeTime.value.isMonthPicker ? changeTime.value.MonthDate : changeTime.value.dateStr;
    try {
        const { dates, income, expenses } = await DB.getMonthlyIncomeAndExpenses(type, date);
        setLineChartData(dates, income, expenses);

        // 计算总收入和总支出
        totalIncome.value = income.reduce((acc, val) => acc + val, 0);
        totalExpenses.value = expenses.reduce((acc, val) => acc + val, 0);

        const { labels, data } = await DB.getExpensesByCategory(type, date);
        if (data.length !== 0) {
            setPieChartData(labels, data);
        } else {
            setPieChartData(['暂无数据'], [1]);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 生成最近5年日期到自定义列表
function genYear() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    for (let i = startYear; i <= currentYear; i++) {
        changeTime.value.options.push(String(i));
    }
}
</script>
<template>
    <Card>
        <template v-slot:title>
            <div class="flex items-center justify-between mb-0">
                <div class="font-semibold text-xl mb-4">{{ changeTime.title }}</div>
                <Button icon="pi pi-arrow-right-arrow-left" class="p-button-text" @click="toggle" />
            </div>
        </template>

        <template v-slot:content>
            <div class=" flex justify-center">
                <DatePicker v-if="changeTime.isMonthPicker" @update:model-value="changeMonthDate"
                    v-model="changeTime.MonthDate" view="month" dateFormat="mm/yy" />

                <div v-if="!changeTime.isMonthPicker" class="flex flex-wrap justify-center gap-3">
                    <SelectButton v-for="item in changeTime.options" :key="item" @click="changeYearDate(item)" v-model="changeTime.dateStr"
                        :options="[item]" />
                </div>
            </div>
        </template>
    </Card>
    <Fluid style="margin-top: 10px;" class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">收入/支出</div>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
                <div class="mt-4">
                    <div class="flex justify-between">
                        <Tag severity="success" :value="'收入:' + totalIncome.toFixed(2) + '元'"></Tag>
                        <Tag  severity="danger" :value="'支出:' + totalExpenses.toFixed(2)+ '元'"></Tag>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">分类支出排行</div>
                <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
    </Fluid>
</template>