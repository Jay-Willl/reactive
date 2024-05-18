import hashlib


class Event:
    def __init__(self, pid, tid, st, et, dur, name):
        self.pid = pid
        self.tid = tid
        self.st = st
        self.et = et
        self.dur = dur
        self.name = name
        self.str = f'EVENT {self.name}: <{self.dur}><{self.st} -> {self.et}>'
        self.hash = hashlib.sha256(self.str.encode()).hexdigest()

    def __repr__(self):
        return f'EVENT {self.name}: <{self.dur}><{self.st} -> {self.et}>'

    def to_dict(self):
        return {
            "pid": self.pid,
            "tid": self.tid,
            "st": self.st,
            "et": self.et,
            "value": self.dur,
            "name": self.name,
            "hash": self.hash
        }


class StackEvent:
    def __init__(self, event):
        self.pid = event.pid
        self.tid = event.tid
        self.st = event.st
        self.et = event.et
        self.dur = event.dur
        self.name = event.name
        self.hash = event.hash
        self.level = None
        self.children = list()

    def __repr__(self):
        return f'STACKEVENT {self.name}: <{self.dur}><{self.st} -> {self.et}> at {self.level}'

    def to_dict(self):
        return {
            "pid": self.pid,
            "tid": self.tid,
            "st": self.st,
            "et": self.et,
            "dur": self.dur,
            "name": self.name,
            "hash": self.hash,
            "level": self.level,
            "children": [obj.to_dict() for obj in self.children]
        }


class StatsEvent:
    def __init__(self, name, funcname, filename, lineno,
                 total_time, percentage, primitive_calls, total_calls,
                 time_per_call):
        self.name = name
        self.funcname = funcname
        self.filename = filename
        self.lineno = lineno
        self.total_time = total_time
        self.percentage = percentage
        self.primitive_calls = primitive_calls
        self.total_calls = total_calls
        self.time_per_call = time_per_call

    def __lt__(self, other):
        return self.percentage < other.percentage

    def to_dict(self):
        return {
            "name": self.name,
            "funcname": self.funcname,
            "filename": self.filename,
            "lineno": self.lineno,
            "total_time": self.total_time,
            "percentage": self.percentage,
            "primitive_calls": self.primitive_calls,
            "total_calls": self.total_calls,
            "time_per_call": self.time_per_call,
        }


class Metadata:
    def __init__(self):
        self.glob_st = None
        self.glob_et = None
        self.root_event = None


class BaseProfilerResult:
    def __init__(self, statsview):
        self.statsview = statsview

    def to_dict(self):
        return {
            "statsview": self.statsview
        }


class EventProfilerResult:
    def __init__(self, functions, files, listview, stackview, rootevent):
        self.functions = functions
        self.files = files
        self.listview = listview
        self.stackview = stackview
        self.rootevent = rootevent

    def to_dict(self):
        return {
            "functions": self.functions,
            "files": self.files,
            "listview": self.listview,
            # "stackview": self.stackview,
            "stackview": self.rootevent
        }
