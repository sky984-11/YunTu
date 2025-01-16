'''
Description: 
Author: sky
Date: 2024-10-17 09:06:05
LastEditTime: 2024-11-22 08:47:54
LastEditors: sky
'''

import re
import pandas as pd


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


# 先用支付宝的，后面在解耦
def parser(data):
    result = {}
    
    for item in data:
        sourcemMatch = re.findall('^账单\s*分\s*类\s*(.*)>',item)
        if sourcemMatch and sourcemMatch[0]:
            result['source'] = '支付宝'     # 来源
            result['category'] = sourcemMatch[0]   # 分类

        rideTimeMatch = re.findall('^乘\s*车\s*时\s*间\s*([\d-]+\s[\d:]+)',item)  # 乘车时间
        if rideTimeMatch and rideTimeMatch[0]:
            result['ride_time'] = rideTimeMatch[0]

        paymentMethodMatch = re.findall('^付\s*款\s*方\s*式\s*(.*)>',item)  # 支付方式
        if paymentMethodMatch and paymentMethodMatch[0]:
            result['payment_method'] = paymentMethodMatch[0]


        remarkMatch = re.findall('^(商\s*品\s*说\s*明|转\s*账\s*备\s*注)\s*(.*)',item)     # 描述
        # print(remarkMatch)
        if (remarkMatch and remarkMatch[0]):
            result['remark'] = remarkMatch[0][1]
        

        payTimeMatch = re.findall(r'^(支\s*付\s*时\s*间|创\s*建\s*时\s*间)\s*([\d-]+\s[\d:]+)',item)   # 支付时间
        if (payTimeMatch and payTimeMatch[0]) :
            result['created_at'] = payTimeMatch[0][1]

        recipientMatch = re.findall('^收款方全称\s*(.*)',item)   # 收款方全称
        if (recipientMatch and recipientMatch[0]) :
            result['recipient'] = recipientMatch[0]

        amountMatch = re.findall('^-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})$',item)   #金额
        if (amountMatch and amountMatch[0]) :
            result['amount'] = float(amountMatch[0].replace(',', '').replace('-', ''))
            result['type']  = amountMatch[0].startswith('-')
        
    # 收款方
    target_value = "账单详情 全部账单"
    if target_value in data:
        index = data.index(target_value)
        next_two = data[index + 1: index + 3]

        # 如果存在两个元素
        if len(next_two) == 2:
            first, second = next_two

            # 使用金额正则判断最后一项是否是金额
            if re.match(r'^-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})$', second):
                result['payee'] = first.replace('>', '')   # 如果最后一个是金额，取前一个
            else:
                result['payee'] = second.replace('>', '')  # 否则取最后一个

    return result


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
            item_dict = {'created_at': item['交易时间'],'payee': item['交易对方']}
            if item['收/支'] == '支出':
                item_dict['type'] = True
            elif item['收/支'] == '收入':
                item_dict['type'] = False
            else:
                continue   # 跳过不计收支的数据
        
            if source == '微信':
                item_dict['amount'] = float(item['金额(元)'].lstrip('¥'))
                item_dict['remark'] = item['备注'].replace('/', '') + item['商品'].replace('/', '')
                item_dict['category_id'] = categories.get(item['交易类型'],30)
                item_dict['payment_method'] = item['支付方式'].replace('/', '')
                item_dict['status'] = item['当前状态']
            elif source == '支付宝':  
                item_dict['amount'] = float(item['金额'].replace('-', ''))
                item_dict['remark'] = item['商品说明']
                item_dict['category_id'] = categories.get(item['交易分类'],30)
                item_dict['payment_method'] = item.get('收/付款方式')
                item_dict['status'] = item['交易状态']

                            # 替换所有 nan 值为 None
            for key, value in item_dict.items():
                if pd.isna(value):
                    item_dict[key] = None
            transformed_data.append(item_dict)

        return {'code': 200, 'data': transformed_data,'msg':'解析成功'}

    except Exception as e:
        return {'code': 500, 'msg': f'文件解析失败: {e}'}
