import cProfile
import multiprocessing
import pstats
import os
import operator
import runpy
import time
from inspect import isfunction


class Profiler:
    def __init__(self, run_obj):
        self.obj = run_obj
        self.obj_type = self.get_obj_type(run_obj)
        self.init_profiler()

    def run(self):
        return self.profile

    def get_obj_type(self, run_obj):
        # print(type(self.obj))
        if str(self.obj).endswith('.py'):
            return 'module'
        elif isfunction(self.obj):
            return 'function'
        elif os.path.isdir(self.obj):
            return 'package'

    def init_profiler(self):
        if self.obj_type == 'function':
            self.profile = self.function_profiler
        elif self.obj_type == 'module':
            self.profile = self.module_profiler
        elif self.obj_type == 'package':
            self.profile = self.package_profiler

    @staticmethod
    def parse_prof_stats(prof):
        records = []
        for info, params in prof.stats.items():
            filename, lineno, funcname = info
            cum_calls, num_calls, time_per_call, cum_time, _ = params
            if prof.total_tt == 0:
                percentage = 0
            else:
                percentage = round(100 * (cum_time / prof.total_tt), 4)
            cum_time = round(cum_time, 4)
            func_name = '%s @ %s' % (funcname, filename)
            records.append(
                (filename, lineno, funcname, cum_time, percentage, num_calls,
                 cum_calls, time_per_call, filename))
        return sorted(records, key=operator.itemgetter(4), reverse=True)

    def function_profiler(self):
        prof = cProfile.Profile()
        prof.enable()
        # >>> #
        result = self.obj()
        # <<< #
        prof.disable()
        prof_stats = pstats.Stats(prof)
        prof_stats.calc_callees()
        call_stats = self.parse_prof_stats(prof_stats)
        return {
            'result': result,
            'timestamp': int(time.time()),
            'totalTime': prof_stats.total_tt,
            'primitiveCalls': prof_stats.prim_calls,
            'totalCalls': prof_stats.total_calls,
            'callStats': call_stats
        }

    def module_profiler(self):
        prof = cProfile.Profile()
        prof.enable()
        # >>> #
        result = runpy.run_path(self.obj)
        # <<< #
        prof.disable()
        prof_stats = pstats.Stats(prof)
        prof_stats.calc_callees()
        call_stats = self.parse_prof_stats(prof_stats)
        return {
            'result': result,
            'timestamp': int(time.time()),
            'totalTime': prof_stats.total_tt,
            'primitiveCalls': prof_stats.prim_calls,
            'totalCalls': prof_stats.total_calls,
            'callStats': call_stats
        }

    def package_profiler(self):
        prof = cProfile.Profile()
        prof.enable()
        # >>> #
        result = runpy.run_module(self.obj)
        # <<< #
        prof.disable()
        prof_stats = pstats.Stats(prof)
        prof_stats.calc_callees()
        call_stats = self.parse_prof_stats(prof_stats)
        return {
            'result': result,
            'timestamp': int(time.time()),
            'totalTime': prof_stats.total_tt,
            'primitiveCalls': prof_stats.prim_calls,
            'totalCalls': prof_stats.total_calls,
            'callStats': call_stats
        }
