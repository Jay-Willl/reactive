import gc
import os
import sys
from collections import deque

import psutil


BYTES = 1024 * 1024


class Utils:
    @staticmethod
    def record_memory():
        gc.collect()
        return gc.get_objects()



class mProfile:
    def __init__(self, target_obj):
        self.events_list = deque()
        self.trace_function = sys.gettrace()
        self.process = psutil.Process(os.getpid())
        self.event_processed = []
        self.memory_overhead = None
        self.target_obj = target_obj

    def __enter__(self):
        sys.settrace(self.trace_memory)

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.settrace(self.trace_function)

    def trace_memory(self, frame, event, arg):
        if event == 'line' and frame.f_code.co_filename in self.target_obj:
            self.events_list.append(
                (self.process.memory_info().rss, frame)
            )
            return self.trace_memory

    @property
    def code_events(self):
        if self.events_list:
            return self.events_list

        return self.events_list




class MemoryProfiler():
    def __init__(self, obj):
        self.obj = obj
        self.init_profiler(obj)

    def run(self):
        return self.profile()

    def init_profiler(self, obj):
        self.init_module(obj)

    def init_module(self, obj):
        self.profile = self.profile_module

    def profile_module(self):
        pass
