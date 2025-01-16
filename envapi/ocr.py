'''
Description: 
Author: sky
Date: 2024-10-17 09:05:45
LastEditTime: 2024-10-17 13:41:32
LastEditors: sky
'''
from paddleocr import PaddleOCR

# 初始化 PaddleOCR，使用简体中文识别
ocr = PaddleOCR(use_angle_cls=True, lang="ch")

def perform_ocr(img_path):
    """
    进行 OCR 识别，并按照行分组输出结果。

    参数:
    img_path (str): 图像文件的路径。

    返回:
    list: 包含每行文本的列表。
    """
    # 进行 OCR 识别，返回结果包含位置信息和文本内容
    result = ocr.ocr(img_path, cls=True)

    # 按照行分组输出结果
    lines = []

    for line in result[0]:
        # line[0] 是文本框的四个顶点，line[1][0] 是识别的文本
        position = line[0]
        text = line[1][0]

        # 计算文本框的中点 y 坐标，用于行的分组
        mid_y = (position[0][1] + position[2][1]) / 2

        # 找到该文本属于哪一行
        inserted = False
        for group in lines:
            # 如果当前文本框的 y 坐标接近某一行的 y 坐标，就将文本添加到该行
            if abs(group["mid_y"] - mid_y) < 10:  # 假设行之间的间距小于 10 像素
                group["texts"].append(text)
                inserted = True
                break
        
        # 如果当前文本不属于任何已有的行，则新建一行
        if not inserted:
            lines.append({"mid_y": mid_y, "texts": [text]})

    # 输出每一行的文本
    output_lines = []
    for group in lines:
        output_lines.append(' '.join(group["texts"]))

    return output_lines

# 示例调用
if __name__ == "__main__":
    img_path = '地铁.jpg'
    lines = perform_ocr(img_path)
    for line in lines:
        print(line)