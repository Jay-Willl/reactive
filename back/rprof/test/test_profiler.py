from rprof.profiler import Profiler


_MODULE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg/dummy_module.py'
_PACKAGE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg'

if __name__ == '__main__':
    test_profiler = Profiler(_MODULE_FILENAME)
    print(test_profiler.run())
