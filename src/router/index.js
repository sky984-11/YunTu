/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-11-18 09:02:17
 * @LastEditors: sky
 */
import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/details:records_id',
                    name: 'details',
                    props: true,
                    component: () => import('@/views/Details.vue')
                },
                {
                    path: '/suggestions',
                    name: 'Suggestions',
                    component: () => import('@/views/Suggestions.vue')
                },
                {
                    path: '/statistics',
                    name: 'Statistics',
                    component: () => import('@/views/Statistics.vue')
                },
                {
                    path: '/yesterday-review',
                    name: 'YesterdayReview',
                    component: () => import('@/views/YesterdayReview.vue')
                },
                {
                    path: '/settings',
                    name: 'Settings',
                    component: () => import('@/views/Settings.vue')
                },
                {
                    path: '/help',
                    name: 'Help',
                    component: () => import('@/views/Help.vue')
                },
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
