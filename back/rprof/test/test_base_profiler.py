from icecream import ic

from rprof.profiler.base_profiler import BaseProfiler

_MODULE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg/dummy_module.py'
_PACKAGE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg'

if __name__ == '__main__':
    test_profiler = BaseProfiler(_MODULE_FILENAME)
    prof_stats = test_profiler.run()
