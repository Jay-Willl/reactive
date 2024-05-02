import types
import hashlib

from profiler.base_profiler import *
from profiler.event_profiler import *


class Frame:
    def __init__(self, name, code):
        self.name = name
        self.code = code
        self.profiler = BaseProfiler(self.name)
