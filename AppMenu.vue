<!--
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-11-18 09:06:18
 * @LastEditors: sky
-->
<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: '云图记账',
        items: [
        { label: '记账薄', icon: 'pi pi-fw pi-file-edit', to: '/' },
        { label: '统计', icon: 'pi pi-fw pi-chart-bar', to: '/statistics' },
        { label: '昨日回顾', icon: 'pi pi-fw pi-calendar-minus', to: '/yesterday-review' },
        { label: '设置', icon: 'pi pi-fw pi-cog', to: '/settings' },
        { label: '帮助', icon: 'pi pi-fw pi-question-circle', to: '/help' },
        { label: '功能与建议', icon: 'pi pi-fw  pi-comment', to: '/suggestions' },
    ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
