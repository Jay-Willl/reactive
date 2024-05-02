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
        self.hash = hashlib.sha256(self.str.encode())

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
            "hash": self.hash.hexdigest()
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
            "hash": self.hash.hexdigest(),
            "level": self.level,
            "children": [obj.to_dict for obj in self.children]
        }


class EventProfilerResult:
    def __init__(self, metadata, listview, stackview, functions, files):
        self.metadata = metadata
        self.listview = listview
        self.stackview = stackview
        self.functions = functions
        self.files = files

    def __repr__(self):
        return

    def to_dict(self):
        return {
            "metadata": self.metadata,
            "listview": self.listview,
            "stackview": self.stackview,
            "functions": self.functions,
            "files": self.files
        }
