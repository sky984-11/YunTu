/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-09-18 17:10:55
 * @LastEditTime: 2024-10-19 09:11:38
 * @LastEditors: sky
 */
// http.js

import { fetch } from '@tauri-apps/plugin-http';


const MAX_RETRIES = 0; // 最大重试次数
const RETRY_DELAY = 2000; // 重试延迟时间（毫秒）

/**
 * 发起 HTTP 请求，并增加重试机制
 * @param {Object} opts 请求选项
 * @returns {Promise} 返回 Promise 对象
 */
export const http = async (opts = {}) => {
  const { url, method, query, data, headers, callback } = opts;
  let retries = 0;

  const performRequest = async () => {
    try {
      const response = await fetch(url, {
        method: method || 'GET',
        headers: {
          ...headers,
        },
        query: query,
        body: data,
      });

      if (response.ok) {
        callback && callback(response);
        return await response.json(); // Now access response data correctly
      } else {
        throw new Error(`Request failed with status code: ${response.status}, Error: ${response.data?.message}`);
      }
    } catch (error) {
      if (retries < MAX_RETRIES) {
        retries++;
        console.warn(`Request failed, retrying ${retries} time...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return performRequest();
      } else {
        // console.error('Reached max retry attempts, giving up.');
        throw error;
      }
    }
  };

  return performRequest();
};
