'''
Description: 
Author: sky
Date: 2024-11-06 08:51:49
LastEditTime: 2024-11-06 14:00:06
LastEditors: sky
'''
"""
@ Date: 2024-04-07 11:23:28
@ LastEditors: liupeng
@ LastEditTime: 2024-04-08 15:06:35
@ FilePath: /script/设备纳管/log.py
@ Desc: 日志记录器
"""
import inspect
import logging
from logging.handlers import TimedRotatingFileHandler

class MyLogger:
    """
    日志记录器
    log_file:日志文件路径
    isPrint:是否启用控制台打印,启用的话写入日志的同时也会在控制台打印一遍
    """

    _instance = None

    def __new__(cls, log_file='./yuntu.log', isPrint=False):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance.log_file = log_file
            cls._instance.isPrint = isPrint
            cls._instance._setup_logger()
        return cls._instance

    def _setup_logger(self):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

        if self.logger.hasHandlers():
            self.logger.handlers.clear()

        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

        # 添加文件处理器
        handler = TimedRotatingFileHandler(filename=self.log_file, when='midnight', interval=1,backupCount=30)
        handler.suffix = '%Y%m%d.log'
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

        # 如果需要在控制台打印日志，则添加控制台处理器
        if self.isPrint:
            console_handler = logging.StreamHandler()
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)

    @staticmethod
    def _get_caller_name():
        current_frame = inspect.currentframe()
        caller_frame = inspect.getouterframes(current_frame)[2]
        caller_name = caller_frame[3]
        return caller_name

    def info(self, msg):
        caller_name = self._get_caller_name()
        log_message = f"{caller_name} - {msg}"
        self.logger.info(log_message)

    def error(self, msg):
        caller_name = self._get_caller_name()
        log_message = f"{caller_name} - {msg}"
        self.logger.error(log_message)

    def warning(self, msg):
        caller_name = self._get_caller_name()
        log_message = f"{caller_name} - {msg}"
        self.logger.warning(log_message)

    def debug(self, msg):
        caller_name = self._get_caller_name()
        log_message = f"{caller_name} - {msg}"
        self.logger.debug(log_message)


log = MyLogger()
