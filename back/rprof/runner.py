import builtins
import gzip
import multiprocessing
import os
import psutil
import json


class IsolateRunner(multiprocessing.Process):
    """Process subclass that propagates exceptions to parent process.

    Also handles sending function output to parent process.
    Args:
        parent_conn: Parent end of multiprocessing.Pipe.
        child_conn: Child end of multiprocessing.Pipe.
        result: Result of the child process.
    """

    def __init__(self, result, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.parent_conn, self.child_conn = multiprocessing.Pipe()
        self.result = result

    def run(self):
        try:
            self.result.update(
                self._target(*self._args, **self._kwargs))
            self.child_conn.send(None)
        except Exception as exc:  # pylint: disable=broad-except
            self.child_conn.send(exc)

    @property
    def exception(self):
        """Returns exception from child process."""
        return self.parent_conn.recv()

    @property
    def output(self):
        """Returns target function output."""
        return self.result._getvalue()  # pylint: disable=protected-access


def run_isolately(func, *args, **kwargs):
    """Runs function in separate process.

    This function is used instead of a decorator, since Python multiprocessing
    module can't serialize decorated function on all platforms.
    """
    manager = multiprocessing.Manager()
    manager_dict = manager.dict()
    process = IsolateRunner(
        manager_dict, target=func, args=args, kwargs=kwargs)
    process.start()
    process.join()
    exc = process.exception
    if exc:
        raise exc
    return process.output




