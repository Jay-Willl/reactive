class EventForMinHeap:
    def __init__(self, e):
        self.pid = e.pid
        self.tid = e.tid
        self.st = e.st
        self.et = e.et
        self.dur = e.dur
        self.name = e.name
        self.hash = e.hash

    def __repr__(self):
        return f'EventForMinHeap {self.name}: <{self.dur}><{self.st} -> {self.et}>'

    def __lt__(self, other):
        return self.st < other.st


class EventForMaxHeap:
    def __init__(self, e):
        self.pid = e.pid
        self.tid = e.tid
        self.st = e.st
        self.et = e.et
        self.dur = e.dur
        self.name = e.name
        self.hash = e.hash

    def __repr__(self):
        return f'EventForMaxHeap {self.name}: <{self.dur}><{self.st} -> {self.et}>'

    def __lt__(self, other):
        return self.et < other.et

