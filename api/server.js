/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-09-19 08:56:50
 * @LastEditTime: 2025-01-16 14:56:49
 * @LastEditors: liupeng
 */
import { http } from '@/utils/request';

const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default class Api {
    /**
 * ceshi
 * @returns
 */
    static async test() {
        return http({
            url: `${BASE_URL}`,
            method: 'GET'
        });
    }
    /**
    * 历史数据导入接口，不开放
    * @returns
    */
    static async historyUpload() {
        return http({
            url: `${BASE_URL}/history`,
            method: 'GET'
        });
    }

    /**
    * 更新接口
    * @returns
    */
    static async update() {
        return http({
            url: `${BASE_URL}/update`,
            method: 'GET'
        });
    }

    /**
     * 图片上传解析
     * @param {Object} file 文件对象
     * @returns
     */
    static async uploadImage(file) {
        const formData = new FormData();

        // 添加文件到 formData
        formData.append('file', file);

        // 发起 HTTP 请求上传文件
        return http({
            url: `${BASE_URL}/upload`,  // 对应 FastAPI 后端的上传接口
            method: 'POST',
            data: formData,  // 使用 formData 包含文件数据
        });
    }

    /**
     * 账单批量导入
     * @param {Object} file 文件对象
     * @param {string} password 文件压缩包密码
     * @returns
     */
    static async batchUpload(file, password) {
        const formData = new FormData();

        // 添加文件到 formData
        formData.append('file', file);
        // 添加密码到 formData
        formData.append('password', password);
        console.log(formData)

        // 发起 HTTP 请求上传文件
        return http({
            url: `${BASE_URL}/batch/upload`,  // 对应 FastAPI 后端的上传接口
            method: 'POST',
            data: formData,  // 使用 formData 包含文件数据和密码
        });
    }

    /**
 * 获取请求客户端IP(用来统计使用人数)
 * @returns
 */
    static async getClientIp() {
        return http({
            url: `${BASE_URL}/get-client-ip`,
            method: 'GET'
        });
    }

    /**
     * 提交反馈
     * @param {Object} text 反馈信息
     * @returns
     */
    static async suggestions(text) {
        try {
            const response = await http({
                url: `${BASE_URL}/suggestions`,
                method: 'POST',
                data: {text:text}, 
            });
            return response;
        } catch (error) {
            console.error("Error submitting suggestion:", error || error);
            throw error;
        }
    }



}
