#! /bin/bash
###
 # @Description: 
 # @Author: sky
 # @Date: 2024-10-17 13:55:06
 # @LastEditTime: 2024-11-22 11:46:32
 # @LastEditors: sky
### 

python3.12 -m venv envapi
cd envapi
source bin/activate  # 激活虚拟环境
pip install 'piccolo[sqlite]' paddlepaddle paddleocr pandas setuptools "fastapi[standard]" uvicorn -i https://pypi.tuna.tsinghua.edu.cn/simple