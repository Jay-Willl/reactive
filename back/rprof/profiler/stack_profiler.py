import os
import operator
import runpy
import time
import signal
import inspect
from icecream import ic

from rprof.runner import run_isolately


class FrameInspector:
    def __init__(self):
        self.INTERVAL = self.decide_interval()
        self.stats = dict()
        self.st = None
        self.dur = None
        self.root_frame = None

    @staticmethod
    def decide_interval():
        return 0.001

    def __enter__(self):
        signal.signal(signal.SIGPROF, self.sample)
        signal.setitimer(signal.ITIMER_PROF, self.INTERVAL)
        self.st = time.time_ns()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.dur = time.time_ns() - self.st
        signal.setitimer(signal.ITIMER_PROF, 0)

    def sample(self, signum, frame):
        stack = []
        while frame and frame != self.root_frame:
            stack.append((
                frame.f_code.co_name,
                frame.f_code.co_filename,
                frame.f_code.co_firstlineno))
            frame = frame.f_back
        self.stats[tuple(stack)] += 1
        signal.setitimer(signal.ITIMER_PROF, self.INTERVAL)


class StackProfiler:
    def __init__(self, obj):
        self.obj = obj
        self.init_profiler(obj)

    def run(self):
        return self.profile()

    def init_profiler(self, obj):
        self.init_module(obj)
        # if self.obj_type == 'function':
        #     self.profile = self.function_profiler
        # elif self.obj_type == 'module':
        #     self.profile = self.module_profiler
        # elif self.obj_type == 'package':
        #     self.profile = self.package_profiler

    def init_module(self, obj):
        self.profile = self.profile_module
        self.run_object, _, self.run_args = obj.partition(' ')
        self.obj_name = '%s <module>' % self.run_object
        self.globals = {
            '__file__': self.run_object,
            '__name__': '__main__',
            '__package__': None,
        }

    def profile_module(self):
        return run_isolately(self._profile_module)

    def _profile_module(self):
        with open(self.obj, 'rb') as src, FrameInspector() as prof:
            code = compile(src.read(), self.run_object, 'exec')
            prof.base_frame = inspect.currentframe()
            try:
                exec(code, self.globals, None)
            except SystemExit:
                pass

