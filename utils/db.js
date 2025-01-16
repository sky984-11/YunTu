import Database from '@tauri-apps/plugin-sql';
import { LazyStore } from '@tauri-apps/plugin-store';
import { format, sub, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, subWeeks, startOfWeek, endOfWeek, subMonths, startOfYear, endOfYear, subYears, startOfDay, endOfDay } from 'date-fns';
import { mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';


let db;
let store

const DB = {
    async initDB() {
        try {
            // 初始化数据库
            db = await Database.load(
                "sqlite:YunTu.db"
            );
            // 初始化键值对数据库
            store = new LazyStore('settings.json')

            // 创建分类表
            await db.execute(`
              CREATE TABLE IF NOT EXISTS account_categories (
                    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    icon TEXT NOT NULL,
                    color TEXT NOT NULL,
                    bg_color TEXT NOT NULL
                );
          `);

            // 创建交易记录表
            await db.execute(`
                        CREATE TABLE IF NOT EXISTS transactions (
                            records_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            amount REAL NOT NULL,
                            remark TEXT,
                            type BOOLEAN DEFAULT TRUE,
                            payment_method TEXT,
                            payee TEXT,
                            recipient TEXT,
                            source TEXT,
                            ride_time DATETIME,
                            image TEXT,
                            category_id INTEGER NOT NULL,
                            FOREIGN KEY (category_id) REFERENCES account_categories (category_id)
                            UNIQUE (amount, created_at, payee)
                        );
                    `);
            // 初始化分类表数据
            const categories = [
                { name: '餐饮美食', icon: 'hamburger', color: 'text-orange-500', bg_color: 'bg-orange-100' },
                { name: '服饰装扮', icon: 'tshirt', color: 'text-blue-500', bg_color: 'bg-blue-100' },
                { name: '日用百货', icon: 'box-open', color: 'text-gray-500', bg_color: 'bg-gray-100' },
                { name: '家具家装', icon: 'couch', color: 'text-green-500', bg_color: 'bg-green-100' },
                { name: '数码电器', icon: 'camera-retro', color: 'text-purple-500', bg_color: 'bg-purple-100' },
                { name: '运动户外', icon: 'running', color: 'text-red-500', bg_color: 'bg-red-100' },
                { name: '美容美发', icon: 'cut', color: 'text-pink-500', bg_color: 'bg-pink-100' },
                { name: '母婴亲子', icon: 'baby-carriage', color: 'text-teal-500', bg_color: 'bg-teal-100' },
                { name: '宠物', icon: 'cat', color: 'text-yellow-500', bg_color: 'bg-yellow-100' },
                { name: '交通出行', icon: 'bus', color: 'text-indigo-500', bg_color: 'bg-indigo-100' },
                { name: '爱车养车', icon: 'car', color: 'text-blue-700', bg_color: 'bg-blue-200' },
                { name: '住房物业', icon: 'building', color: 'text-brown-500', bg_color: 'bg-brown-100' },
                { name: '酒店旅游', icon: 'suitcase-rolling', color: 'text-orange-600', bg_color: 'bg-orange-200' },
                { name: '文化休闲', icon: 'book', color: 'text-green-400', bg_color: 'bg-green-200' },
                { name: '教育培训', icon: 'book-reader', color: 'text-purple-400', bg_color: 'bg-purple-200' },
                { name: '医疗健康', icon: 'briefcase-medical', color: 'text-red-600', bg_color: 'bg-red-200' },
                { name: '生活服务', icon: 'utensils', color: 'text-gray-700', bg_color: 'bg-gray-200' },
                { name: '商业服务', icon: 'wallet', color: 'text-teal-600', bg_color: 'bg-teal-200' },
                { name: '公益捐赠', icon: 'hand-holding-heart', color: 'text-pink-600', bg_color: 'bg-pink-200' },
                { name: '互助保障', icon: 'hand-holding-medical', color: 'text-blue-500', bg_color: 'bg-blue-200' },
                { name: '投资理财', icon: 'chart-line', color: 'text-green-600', bg_color: 'bg-green-200' },
                { name: '保险', icon: 'shield-alt', color: 'text-gray-800', bg_color: 'bg-gray-300' },
                { name: '信用借还', icon: 'money-check-alt', color: 'text-yellow-600', bg_color: 'bg-yellow-200' },
                { name: '充值缴费', icon: 'credit-card', color: 'text-blue-500', bg_color: 'bg-blue-200' },
                { name: '收入', icon: 'piggy-bank', color: 'text-green-700', bg_color: 'bg-green-300' },
                { name: '转账红包', icon: 'exchange-alt', color: 'text-purple-600', bg_color: 'bg-purple-300' },
                { name: '亲友代付', icon: 'hand-holding-usd', color: 'text-teal-500', bg_color: 'bg-teal-300' },
                { name: '账户存取', icon: 'donate', color: 'text-orange-500', bg_color: 'bg-orange-300' },
                { name: '退款', icon: 'undo-alt', color: 'text-red-500', bg_color: 'bg-red-300' },
                { name: '其他', icon: 'qrcode', color: 'text-gray-600', bg_color: 'bg-gray-300' }
            ];


            const categoriesCount = await this.getCount('account_categories');
            if (categoriesCount[0].count === 0) {
                for (const category of categories) {
                    await this.insert('account_categories', category);
                }

                // 初始化设置
                await this.saveSettings('screenshot_recognition', true)  // 默认开启图片识别
                await this.saveSettings('batch_recognition', false)  // 默认关闭批量图片识别，开启后添加支持多选图片识别(预留设置)

                const imagesExists = await exists('images', {
                    baseDir: BaseDirectory.AppLocalData,
                });
                if (!imagesExists) {
                    // 创建图片文件夹
                    await mkdir('images', {
                        baseDir: BaseDirectory.AppLocalData,
                    });

                }

            }



        } catch (error) {
            console.error('初始化数据库时出错:', error);
        }
    },

    async insert(tableName, data, excludeFields = []) {
        // 过滤掉排除的字段
        const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (!excludeFields.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {});

        // 获取字段名和对应的值
        const columns = Object.keys(filteredData).join(", ");
        const placeholders = Object.keys(filteredData).map(() => "?").join(", ");
        const values = Object.values(filteredData);

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

        try {
            const result = await db.execute(sql, values);
            return result.lastInsertId;  // 返回最后插入的行 ID
        } catch (err) {
            console.error("插入失败:", err);
            throw err;
        }
    },

    async list(tableName, where, joinTable = null, joinCondition = null) {
        // 构建 SQL 查询语句
        let sql = `SELECT * FROM ${tableName}`;

        // 如果有外键关联的表，添加 JOIN 条件
        if (joinTable && joinCondition) {
            sql += ` INNER JOIN ${joinTable} ON ${joinCondition}`;
        }

        if (where) {
            sql += ` WHERE ${where}`;
        }
        // console.log(sql)
        try {
            // 执行查询并返回结果
            const result = await db.select(sql);
            return result;
        } catch (err) {
            console.error("查询失败:", err);
        }
    },

    // 检查表数据数量
    async getCount(tableName) {
        const result = await db.select(`SELECT COUNT(*) AS count FROM ${tableName}`);
        return result;
    },

    async del(tableName, where) {
        const sql = `DELETE FROM ${tableName} WHERE ${where}`;

        try {
            // 执行 SQL 删除操作
            const result = await db.execute(sql);
            return result;
        } catch (err) {
            console.error("删除失败:", err);
            throw err;
        }
    },

    async edit(tableName, data, where, excludedFields = ['id']) {
        if (!where) {
            throw new Error("更新操作必须提供 id");
        }

        // 剔除 id 和额外的字段，以及值为 null 或 undefined 的字段
        const filteredData = Object.keys(data)
            .filter(key => !excludedFields.includes(key) && data[key] !== null && data[key] !== undefined)
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
        // 如果没有需要更新的字段，则抛出错误
        if (Object.keys(filteredData).length === 0) {
            throw new Error("没有需要更新的字段");
        }

        const setClause = Object.keys(filteredData).map(key => `${key} = ?`).join(", ");
        const setValues = Object.values(filteredData);
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${where}`;

        const allParams = [...setValues];

        try {
            const result = await db.execute(sql, allParams);
            return result.rowsAffected;  // 返回更新的行数
        } catch (err) {
            console.error("更新失败:", err);
            throw err;
        }
    },

    async saveSettings(key, value) {
        await store.set(key, value);
    },

    async loadSettings(key) {
        return store.get(key);
    },

    async getTransactionsByDate(date) {
        // 构建 SQL 查询语句
        const sql = `SELECT * FROM transactions INNER JOIN account_categories ON transactions.category_id = account_categories.category_id  WHERE DATE(created_at) = ?`;

        try {
            // 执行查询并返回结果
            const result = await db.select(sql, [date]);
            return result;
        } catch (err) {
            console.error("查询失败:", err);
        }
    },

    // 获取某个月每天的收入和支出
    async getMonthlyIncomeAndExpenses(timeRange, date) {
        let start, end;
        const today = new Date();
        switch (timeRange) {
            case 'month':
                start = date;
                end = new Date()
                if (!isSameMonth(start, end)) {
                    end = endOfMonth(date)
                }
                break;
            case 'year':
                if (date == '上周') {
                    start = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });  // 周一为一周的开始
                    end = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });  // 周日为一周的结束
                } else if (date == '上月') {
                    start = startOfMonth(subMonths(today, 1));
                    end = endOfMonth(subMonths(today, 1));
                } else if (date == '近一年') {
                    start = sub(today, { years: 1 })
                    end = today

                } else {
                    start = startOfYear(new Date(date, 0, 1));
                    end = endOfYear(new Date(date, 0, 1));
                }
                break;
            default:
                throw new Error('无效的时间范围');
        }

        const days = eachDayOfInterval({ start, end });
        const stats = {
            dates: [],
            income: [],
            expenses: []
        };

        for (const day of days) {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const income = await this.getTransactionsByDateAndType(formattedDate, false);  // 收入
            const expenses = await this.getTransactionsByDateAndType(formattedDate, true);  // 支出

            stats.dates.push(format(day, 'MM-dd'));
            stats.income.push(income.reduce((sum, transaction) => sum + transaction.amount, 0));  // 收入总和
            stats.expenses.push(expenses.reduce((sum, transaction) => sum + transaction.amount, 0));  // 支出总和
        }

        return stats;
    },

    // 按日期和类型获取交易记录
    async getTransactionsByDateAndType(date, type) {
        const sql = `SELECT * FROM transactions 
                     INNER JOIN account_categories ON transactions.category_id = account_categories.category_id  
                     WHERE DATE(transactions.created_at) = ? AND type = ?`;

        try {
            const result = await db.select(sql, [date, type]);  // 1 表示收入，0 表示支出
            return result;
        } catch (err) {
            console.error("查询失败:", err);
        }
    },

    // 按类别统计支出，并返回适配 ECharts 饼图的两个列表（data 和 labels）
    async getExpensesByCategory(timeRange, date) {
        let startDate, endDate;
        const today = new Date();
        switch (timeRange) {
            case 'month':
                startDate = date;
                endDate = new Date();
                if (!isSameMonth(startDate, endDate)) {
                    endDate = endOfMonth(date)
                }
                break;
            case 'year':
                if (date == '上周') {
                    startDate = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });  // 周一为一周的开始
                    endDate = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });  // 周日为一周的结束
                } else if (date == '上月') {
                    startDate = startOfMonth(subMonths(today, 1));
                    endDate = endOfMonth(subMonths(today, 1));
                } else if (date == '近一年') {
                    startDate = sub(today, { years: 1 })
                    endDate = today

                } else {
                    startDate = startOfYear(new Date(date, 0, 1));
                    endDate = endOfYear(new Date(date, 0, 1));
                }
                break;

            default:
                throw new Error('无效的时间范围');
        }

        const formattedStartDate = format(startDate, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd HH:mm:ss');

        const sql = `
            SELECT 
                account_categories.name AS category_name, 
                SUM(transactions.amount) AS total_expense
            FROM 
                transactions 
            INNER JOIN 
                account_categories 
            ON 
                transactions.category_id = account_categories.category_id
            WHERE 
                transactions.type = 'true' AND 
                transactions.created_at BETWEEN ? AND ?
            GROUP BY 
                account_categories.name
        `;

        try {
            const result = await db.select(sql, [formattedStartDate, formattedEndDate]);

            // 处理查询结果为空的情况
            if (result.length === 0) {
                // console.log(`查询结果为空，时间范围: ${formattedStartDate} 至 ${formattedEndDate}`);
                return { labels: [], data: [] };
            }

            // 提取类别名称和总支出
            const labels = result.map(item => item.category_name);
            const data = result.map(item => item.total_expense);

            return { labels, data };
        } catch (err) {
            console.error("查询失败:", err);
            throw err;
        }
    }
};

export default DB;