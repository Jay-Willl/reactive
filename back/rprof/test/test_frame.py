from icecream import ic

from rprof.frame import Frame

_MODULE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg/dummy_module.py'
_PACKAGE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg'

if __name__ == '__main__':
    test_frame = Frame(_MODULE_FILENAME)
    result = test_frame.run()
    print(result)


