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


class ExeInfo:
    def __init__(self, metadata, stackevents, functions, files):
        self.metadata = metadata
        self.stackevents = stackevents
        self.functions = functions
        self.files = files

    def __repr__(self):
        return

    def to_dict(self):
        return {
            "metadata": self.metadata,
            "stackevents": self.stackevents,
            "functions": self.functions,
            "files": self.files
        }
