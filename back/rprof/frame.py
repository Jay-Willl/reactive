import types
import hashlib

from .profiler.base_profiler import *
from .profiler.event_profiler import *


class Result:
    def __init__(self, functions, files, listview, stackview, statsview):
        self.functions = functions
        self.files = files
        self.listview = listview
        self.stackview = stackview
        self.statsview = statsview

    def to_dict(self):
        return {
            "functions": self.functions,
            # "files": self.files,
            "listview": self.listview,
            "stackview": self.stackview,
            "statsview": self.statsview
        }


class Frame:
    def __init__(self, name):
        self.name = name
        self.base_profiler = BaseProfiler(self.name)
        self.event_profiler = EventProfiler(self.name)

    def profile(self):
        result = Result(
            **self.event_profiler.run(),
            **self.base_profiler.run()
        )
        return result.to_dict()

    def run(self):
        return self.profile()
