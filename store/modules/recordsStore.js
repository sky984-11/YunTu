/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-09-26 13:57:28
 * @LastEditTime: 2024-10-16 13:59:02
 * @LastEditors: sky
 */

import { defineStore } from 'pinia';
import { store } from '@/store';

export const useRecordsStore = defineStore({
    id: 'device-records',
    state: () => ({
        records: []
    }),
    actions: {
        setRecords(records) {
            this.records = records;
        },
        clearRecords() {
            this.records = [];
        }
    }
});

export function useRecordsStoreHook() {
    return useRecordsStore(store);
}
