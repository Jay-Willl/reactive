import builtins
import gzip
import multiprocessing
import os
import psutil
import json


class IsolateRunner(multiprocessing.Process):
    def __init__(self, result, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.parent_conn, self.child_conn = multiprocessing.Pipe()
        self.result = result

    def run(self):
        try:
            self.result.update(
                self._target(*self._args, **self._kwargs))
            self.child_conn.send(None)
        except Exception as exc:
            import traceback
            stack_trace = traceback.format_exc()
            print(stack_trace)
            self.child_conn.send(exc)

    @property
    def exception(self):
        return self.parent_conn.recv()

    @property
    def output(self):
        return self.result._getvalue()


def run_isolately(func, *args, **kwargs):
    manager = multiprocessing.Manager()
    manager_dict = manager.dict()
    process = IsolateRunner(
        manager_dict, target=func, args=args, kwargs=kwargs)
    process.start()
    process.join()
    exc = process.exception
    if exc:
        pass
    return process.output
