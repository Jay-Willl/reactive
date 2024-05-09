import cProfile
import pstats
import os
import operator
import time
from icecream import ic

from rprof.runner import run_isolately
from .model.base_model import *


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
        # print(stats)
        return BaseProfiler.warp_info(stats)

    @staticmethod
    def parse_raw_stats(raw_stats):
        records = []
        for info, params in raw_stats.stats.items():
            filename, lineno, funcname = info
            total_calls, primitive_calls, time_per_call, total_time, _ = params
            if raw_stats.total_tt == 0:
                percentage = 0
            else:
                percentage = round(100 * (total_time / raw_stats.total_tt), 4)
            # cum_time = round(cum_time, 4)
            name = str('%s (%s:%s)' % (funcname, filename, lineno))
            records.append((
                name,  # <module> (dummy_module.py:1)
                funcname,
                filename,  # '.../dummy_module.py'
                lineno,  # 1
                total_time,  # cumulative time
                percentage,  # cumulative time / total time
                primitive_calls,  #
                total_calls,  # total
                time_per_call,  # average time per call
            ))
        return sorted(records, key=operator.itemgetter(4), reverse=True)

    @staticmethod
    def warp_info(stats):
        stats_view = []
        for stat in stats:
            temp_statsevent = StatsEvent(
                *stat
            )
            stats_view.append(temp_statsevent)
        return BaseProfilerResult(
            statsview=[obj.to_dict() for obj in stats_view]
        ).to_dict()
