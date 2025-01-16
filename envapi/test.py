'''
Description: 
Author: sky
Date: 2024-11-01 08:32:46
LastEditTime: 2024-11-14 08:26:17
LastEditors: sky
'''
import zipfile
# import pandas as pd

# 
# file_path = './api/file/alipay_record_20241028_132101.csv'
# file_path = './api/file/微信支付账单(20240128-20240428).csv'
file_path = './api/file/交易流水证明_用于个人对账_20241028_132101.zip'

zip_file = zipfile.ZipFile(file_path)#文件的路径与文件名
zip_list = zip_file.namelist() # 得到压缩包里所有文件

for f in zip_list:
    # zip_file.extract(f, './cache/',pwd="264107".encode("utf-8")) # 循环解压文件到指定目录
    print(f)
 
zip_file.close() # 关闭文件，必须有，释放内存


categories = {
    "餐饮美食": 1,
    "服饰装扮": 2,
    "日用百货": 3,
    "家具家装": 4,
    "数码电器": 5,
    "运动户外": 6,
    "美容美发": 7,
    "母婴亲子": 8,
    "宠物": 9,
    "交通出行": 10,
    "爱车养车": 11,
    "住房物业": 12,
    "酒店旅游": 13,
    "文化休闲": 14,
    "教育培训": 15,
    "医疗健康": 16,
    "生活服务": 17,
    "商业服务": 18,
    "公益捐赠": 19,
    "互助保障": 20,
    "投资理财": 21,
    "保险": 22,
    "信用借还": 23,
    "充值缴费": 24,
    "收入": 25,
    "转账红包": 26,
    "亲友代付": 27,
    "账户存取": 28,
    "退款": 29,
    "其他": 30,
    "转账": 26,
    "微信红包（群红包）":26
}

# 支出和收入类型之外的数据需要在思考下，哪些需要转化存库，哪些需要丢弃
def parser_csv(file_path):
    if 'alipay' in file_path:
        encoding, skiprows = 'GB18030', 24
        source = '支付宝'
    elif '微信' in file_path:
        encoding, skiprows = 'utf-8', 16
        source = '微信'
    else:
        return {'code': 400, 'msg': '暂不支持该类型文件'}
    try:
        data = pd.read_csv(file_path, encoding=encoding, skiprows=skiprows)
        # print(data)
        transformed_data = []
        for item in data.to_dict(orient='records'):
            # print(item)
            # print(item['收/支'] )
            item_dict = {'created_at': item['交易时间'],'payee': item['交易对方']}
            if item['收/支'] == '支出':
                item_dict['type'] = True
            elif item['收/支'] == '收入':
                item_dict['type'] = False
            else:
                continue   # 跳过不计收支的数据

            if source == '微信':
                item_dict['amount'] = item['金额(元)']
                item_dict['remark'] = item['备注'] + item['商品']
                item_dict['category_id'] = categories.get(item['交易类型'],30)
                item_dict['payment_method'] = item['支付方式']
                item_dict['status'] = item['当前状态']
            elif source == '支付宝':
                item_dict['amount'] = item['金额']
                item_dict['remark'] = item['商品说明']
                item_dict['category_id'] = categories.get(item['交易分类'],30)
                item_dict['payment_method'] = item['收/付款方式']
                item_dict['status'] = item['交易状态']
            transformed_data.append(item_dict)

        return {'code': 200, 'data': transformed_data,'msg':'解析成功'}

    except Exception as e:
        return {'code': 500, 'msg': f'文件解析失败: {e}'}

# parser_csv(file_path)