'''
Description: 
Author: sky
Date: 2024-10-17 09:10:40
LastEditTime: 2024-11-19 09:15:25
LastEditors: sky
'''
from fastapi import FastAPI, Query, Path, Body
from pydantic import BaseModel
from typing import Optional

# 初始化 FastAPI 应用
app = FastAPI()

# 定义一个 Pydantic 模型用于验证 POST 请求体的数据
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# 示例 GET 请求，带路径参数和查询参数
@app.get("/items/{item_id}")
async def read_item(item_id: int = Path(..., title="The ID of the item to get"),
                    q: Optional[str] = Query(None, max_length=50)):
    return {"item_id": item_id, "q": q}

# 示例 POST 请求，接收并返回请求体中的数据
@app.post("/items/")
async def create_item(item: Item = Body(...)):
    item_dict = item.dict()
    if item.tax:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict

# 示例 PUT 请求，更新某个指定 ID 的项目
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item = Body(...)):
    return {"item_id": item_id, "item": item}

# Linux 版本（64 位）
# CentOS 7（GPU版本支持CUDA 10.2/11.2/11.6/11.7）
# Ubuntu 16.04/18.04/20.04/22.04（GPU版本支持CUDA 10.2/11.2/11.6/11.7）
# Python 版本：3.8/3.9/3.10/3.11/3.12（64 位）
# pip 或 pip3 版本 20.2.2+（64 位）

# run server
# https://paddlepaddle.github.io/PaddleOCR/latest/quick_start.html
# pip3 install paddlepaddle
# pip3 install paddleocr
#1. pip install "fastapi[standard]" uvicorn
#2. uvicorn main:app --reload / fastapi dev main.py
#3.web访问
#   http://127.0.0.1:8000/docs
#   http://127.0.0.1:8000/redoc

# 云函数安装
# pip install -t . <PackageName>

# apt-get install libgl1-mesa-glx