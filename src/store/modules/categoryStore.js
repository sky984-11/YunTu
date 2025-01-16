/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-09-26 13:57:28
 * @LastEditTime: 2024-10-19 13:48:52
 * @LastEditors: sky
 */

import { defineStore } from 'pinia';
import { store } from '@/store';

export const useCategoryListStore = defineStore({
    id: 'category-store',
    state: () => ({
        categoryList: [],
        CategoryMap: new Map()
    }),
    actions: {
        setCategoryList(categoryList) {
            this.categoryList = categoryList;
        },
        setCategoryMap(CategoryMap) {
            this.CategoryMap = CategoryMap;
        },
        clearCategoryList() {
            this.categoryList = [];
        }
    }
});

export function useCategoryListStoreHook() {
    return useCategoryListStore(store);
}
