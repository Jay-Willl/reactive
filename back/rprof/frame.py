import types
import hashlib

from profiler import Profiler


class Frame:
    def __init__(self, name, code):
        self.name = name
        self.code = code
        self.profiler = Profiler(self.name, self.code)
