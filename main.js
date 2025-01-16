/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-10-26 15:30:47
 * @LastEditors: sky
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from "./store";

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faHamburger, faTshirt, faBoxOpen, faCouch, faCameraRetro, faRunning, faCut, faBabyCarriage, faCat, faBus, faCar, faBuilding, faSuitcaseRolling, faBook, faBookReader, faBriefcaseMedical, faUtensils, faWallet, faHandHoldingHeart, faHandHoldingMedical, faChartLine, faShieldAlt, faMoneyCheckAlt, faCreditCard, faPiggyBank, faExchangeAlt, faDonate, faUndoAlt, faHandHoldingUsd, faQrcode } from '@fortawesome/free-solid-svg-icons'
library.add(faHamburger, faTshirt, faBoxOpen, faCouch, faCameraRetro, faRunning, faCut, faBabyCarriage, faCat, faBus, faCar, faBuilding, faSuitcaseRolling, faBook, faBookReader, faBriefcaseMedical, faUtensils, faWallet, faHandHoldingHeart, faHandHoldingMedical, faChartLine, faShieldAlt, faMoneyCheckAlt, faCreditCard, faPiggyBank, faExchangeAlt, faDonate, faUndoAlt, faHandHoldingUsd, faQrcode)  // 按需添加图标

import DB from '@/utils/db';
async function initializeDatabase() {
    // 初始化数据库
    await DB.initDB();
}
import ToastService from 'primevue/toastservice';
const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});

app.use(store);
app.use(ToastService);
app.component('font-awesome-icon', FontAwesomeIcon)



async function bootstrap() {
    try {
        await initializeDatabase(); // 等待数据库初始化完成
        app.mount('#app');
    } catch (error) {
        console.error('数据库初始化失败:', error);
    }
}

bootstrap(); // 启动应用