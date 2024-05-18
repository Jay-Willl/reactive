from icecream import ic
import json

from rprof.frame import Frame

_MODULE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/front/test_pkg/dummy_module.py'
_PACKAGE_FILENAME = '/Users/blank/repo_pro/project-whitezone/reactive/front/test_pkg'

if __name__ == '__main__':
    test_frame = Frame(_MODULE_FILENAME)
    result = json.dumps(test_frame.run(), indent=4)
    with open("/Users/blank/repo_pro/project-whitezone/reactive/back/sample.json", 'wb') as f:
        f.write(result.encode('utf-8'))
    print(result)


