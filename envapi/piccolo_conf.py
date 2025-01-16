'''
Description: 
Author: sky
Date: 2024-11-19 13:33:23
LastEditTime: 2024-11-19 14:27:06
LastEditors: sky
'''
from piccolo.engine.sqlite import SQLiteEngine


# 配置数据库引擎
DB = SQLiteEngine(path="yuntu.db")



from piccolo.table import Table
from piccolo.columns import Serial, Text, Timestamptz

import datetime


class Suggestions(Table):
    """
    反馈建议表
    """
    id = Serial(primary_key=True) 
    suggestions = Text()
    ctime = Timestamptz(default=lambda: datetime.datetime.now(datetime.timezone.utc))