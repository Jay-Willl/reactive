import heapq
import json
import math
from collections import deque
from icecream import ic

from viztracer import VizTracer

from rprof.runner import run_isolately
from .model.base_model import *
from .model.calc_model import *

_TEMP_FILEPATH = '/var/tmp/temp_output.json'
_SAMPlE_FILEPATH = '/Users/blank/repo_pro/project-whitezone/reactive/test_pkg/dummy.json'


class EventProfiler:
    def __init__(self, obj):
        self.obj = obj
        self.init_profiler(obj)

    def run(self):
        return self.profile()

    def init_profiler(self, obj):
        self.init_module(obj)

    def init_module(self, obj):
        self.profile = self.profile_module
        self.run_object, _, self.run_args = obj.partition(' ')
        self.obj_name = '%s <module>' % self.run_object
        self.globals = {
            '__file__': self.run_object,
            '__name__': '__main__',
            '__package__': None,
        }

    def profile_module(self):
        return run_isolately(self._profile_module)

    def _profile_module(self):
        with open(self.run_object, 'rb') as src:
            code = compile(src.read(), self.run_object, 'exec')
            try:
                tracer = VizTracer()
                tracer.start()
                exec(code, self.globals, None)
                tracer.stop()
                # tracer.save('/Users/blank/repo_pro/project-whitezone/reactive/test_pkg/dummy.json')
                tracer.save(_TEMP_FILEPATH)
            except Exception:
                import traceback
                traceback.print_exc()
        return EventProfiler.parse_raw_stats()

    @staticmethod
    def parse_raw_stats():
        with open(_TEMP_FILEPATH, 'r') as f:
            raw_data = json.load(f)
            raw_events = raw_data['traceEvents']
            raw_files = raw_data['file_info']['files']
            raw_functions = raw_data['file_info']['functions']

            list_view = list()
            stack_view = list()
            min_heap = list()
            max_heap = list()

            EventProfiler.register_event(
                raw_events=raw_events,
                min_heap=min_heap,
                max_heap=max_heap,
                list_view=list_view
            )
            target_event = EventProfiler.recover_stack(
                raw_events=raw_events,
                min_heap=min_heap,
                max_heap=max_heap,
                stack_view=stack_view
            )
            result = EventProfiler.warp_info(
                raw_events=raw_events,
                raw_files=raw_files,
                raw_functions=raw_functions,
                list_view=list_view,
                stack_view=stack_view,
                target_event=target_event
            ).to_dict()
            # ic(raw_functions)
            # ic(list_view)
            # ic(stack_view)
            # ic(target_event)

            # ic(type(result['listview']))
            # ic(type(result['functions']))
            # ic(type(result['files']))

            # with open(_SAMPlE_FILEPATH, 'w') as f:
            #     # f.write(json.dumps(result['listview']))
            #     # f.write(json.dumps(result['stackview']))
            #     # f.write(json.dumps(result['functions']))
            #     # f.write(json.dumps(result['files']))
            #     # f.write(json.dumps(result['rootevent']))
            #     f.write(json.dumps(result))
            #     f.flush()
            return result

    @staticmethod
    def register_event(raw_events, min_heap, max_heap, list_view):
        glob_st = math.pow(2, 63)
        for raw_event in raw_events:
            if raw_event.get('ts') is not None:
                if raw_event['ts'] < glob_st:
                    glob_st = raw_event['ts']
        for raw_event in raw_events:
            if raw_event.get('dur') is not None:
                temp_event = Event(
                    pid=raw_event['pid'],
                    tid=raw_event['tid'],
                    st=raw_event['ts'] - glob_st,
                    et=raw_event['ts'] + raw_event['dur'] - glob_st,
                    dur=raw_event['dur'],
                    name=raw_event['name']
                )
                list_view.append(temp_event)
                temp_event_minheap = EventForMinHeap(temp_event)
                temp_event_maxheap = EventForMaxHeap(temp_event)
                min_heap.append(temp_event_minheap)
                max_heap.append(temp_event_maxheap)
            else:
                continue
        list_view.sort(key=lambda e: e.st)
        return

    @staticmethod
    def recover_stack(raw_events, min_heap, max_heap, stack_view):
        st_heap = min_heap.copy()
        et_heap = max_heap.copy()
        heapq.heapify(st_heap)
        heapq.heapify(et_heap)

        stk = deque()
        level = 0
        while len(st_heap) != 0:
            temp_stackevent = StackEvent(heapq.heappop(st_heap))
            temp_stackevent.level = level
            stack_view.append(temp_stackevent)
            level += 1
            if len(stk) != 0:
                stk[len(stk) - 1].children.append(temp_stackevent)
            stk.append(temp_stackevent)

            while et_heap[0].hash == temp_stackevent.hash:
                heapq.heappop(et_heap)
                stk.pop()
                if len(stk) == 0:
                    break
                temp_stackevent = stk[len(stk) - 1]
                level -= 1
            # if et_heap[0].hash == temp_stackevent.hash:
            #     heapq.heappop(et_heap)
            #     stk.pop()
            #     level -= 1
            #     temp_stackevent = stk[len(stk) - 1]
            #     while et_heap[0].hash == temp_stackevent.hash:
            #         heapq.heappop(et_heap)
            #         stk.pop()
            #         if len(stk) == 0:
            #             break
            #         temp_stackevent = stk[len(stk) - 1]
            #         level -= 1

        root_event = None
        target_event = None
        glob_st = math.pow(2, 63)
        for raw_event in raw_events:
            if raw_event.get('ts') is not None:
                if raw_event['ts'] < glob_st:
                    glob_st = raw_event['ts']
                    root_event = raw_event
        for stackevent in stack_view:
            if stackevent.name == root_event['name'] \
                    and stackevent.name == 'builtins.exec' \
                    and stackevent.dur == root_event['dur']:
                target_event = stackevent
                break
            else:
                continue
        return target_event.to_dict()

    @staticmethod
    def warp_info(raw_events, raw_files, raw_functions, list_view, stack_view, target_event):
        return EventProfilerResult(
            functions=raw_functions,
            files=raw_files,
            listview=[obj.to_dict() for obj in list_view],
            stackview=[obj.to_dict() for obj in stack_view],
            rootevent=target_event
        )
