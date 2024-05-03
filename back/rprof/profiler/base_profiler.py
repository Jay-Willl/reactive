import cProfile
import pstats
import os
import operator
import time
from icecream import ic

from rprof.runner import run_isolately


class BaseProfiler:
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
        prof = cProfile.Profile()
        try:
            with open(self.run_object, 'rb') as src:
                code = compile(src.read(), self.run_object, 'exec')
            prof.runctx(code, self.globals, None)
        except SystemExit:
            pass
        raw_stats = pstats.Stats(prof)
        stats = self.parse_raw_stats(raw_stats)
        print(stats)
        return {
            'objectName': self.obj_name,
            # 'callStats': self._transform_stats(prof_stats),
            'totalTime': raw_stats.total_tt,
            'primitiveCalls': raw_stats.prim_calls,
            'totalCalls': raw_stats.total_calls,
            'timestamp': int(time.time())
        }

    @staticmethod
    def parse_raw_stats(raw_stats):
        records = []
        for info, params in raw_stats.stats.items():
            filename, lineno, funcname = info
            cum_calls, num_calls, time_per_call, cum_time, _ = params
            if raw_stats.total_tt == 0:
                percentage = 0
            else:
                percentage = round(100 * (cum_time / raw_stats.total_tt), 4)
            cum_time = round(cum_time, 4)
            func_name = str('%s @ %s' % (funcname, filename))
            records.append((
                filename,  # '.../dummy_module.py'
                lineno,  # 1
                func_name,  #
                cum_time,
                percentage,
                num_calls,
                cum_calls,
                time_per_call,
                filename
            ))
        return sorted(records, key=operator.itemgetter(4), reverse=True)

    @staticmethod
    def warp_info():
        pass
