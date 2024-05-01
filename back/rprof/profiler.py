import cProfile
import pstats
import os
import operator
import runpy
import tempfile
import time
from inspect import isfunction
from icecream import ic


class Profiler:
    def __init__(self, name, obj):
        self.name = name
        self.obj = obj
        self.obj_type = self.get_obj_type(obj)
        self.init_profiler()

    def run(self):
        self.profile()

    def get_obj_type(self, obj):
        return 'module'
        # if str(self.obj).endswith('.py'):
        #     return 'module'
        # elif isfunction(self.obj):
        #     return 'function'
        # elif os.path.isdir(self.obj):
        #     return 'package'

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


    def module_profiler(self):
        with tempfile.NamedTemporaryFile(delete=False, prefix=self.name, suffix='.py', mode='w') as f:
            f.write(self.obj)
            temp_path = f.name
            ic(temp_path)

            # prof = cProfile.Profile()
            # prof.enable()
            # # >>> #
            # runpy.run_path(temp_path)
            # # <<< #
            # prof.disable()

            prof = cProfile.Profile()
            try:
                with open(temp_path, 'rb') as srcfile:
                    code = compile(f.read(), temp_path, 'exec')
                prof.runctx(code, None, None)
            except SystemExit:
                pass

            prof_stats = pstats.Stats(prof)
            call_stats = self.parse_prof_stats(prof_stats)
            os.remove(temp_path)

            return {
                'timestamp': int(time.time()),
                'totalTime': prof_stats.total_tt,
                'primitiveCalls': prof_stats.prim_calls,
                'totalCalls': prof_stats.total_calls,
                'callStats': call_stats
            }

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
            'timestamp': int(time.time()),
            'totalTime': prof_stats.total_tt,
            'primitiveCalls': prof_stats.prim_calls,
            'totalCalls': prof_stats.total_calls,
            'callStats': call_stats
        }
