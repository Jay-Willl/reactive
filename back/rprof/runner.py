import builtins
import gzip
import multiprocessing
import os
import psutil
import json

from rprof import profiler


class IsolateRunner(multiprocessing.Process):
    def __init__(self, target, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.target = target
        self.args = args
        self.kwargs = kwargs

    def run(self):
        print(f"Subprocess started for: {self.target}")
        try:
            self.target(self.args, self.kwargs)
        except Exception as e:
            print(f"Subprocess raise exception: {e}")
        finally:
            print(f"Subprocess close for: {self.target}")


def run_isolately(target, *args, **kwargs):
    process = IsolateRunner(target, args, kwargs)
    process.start()
    process.join()





