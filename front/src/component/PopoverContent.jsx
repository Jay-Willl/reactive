import {useMemo, useCallback} from "react";
import {Descriptions} from "antd";
import {useDispatch, useSelector} from "react-redux";

function PopoverContent({parentPlot, eventContent}) {
    const BarChartItems = useMemo(() => [
        {
            key: '1',
            label: 'function name',
            children: null
        },
        {
            key: '2',
            label: 'file name',
            children: null
        },
        {
            key: '3',
            label: 'line number',
            children: null
        },
        {
            key: '4',
            label: 'total time',
            children: null
        },
        {
            key: '5',
            label: 'primitive calls',
            children: null
        },
        {
            key: '6',
            label: 'total calls',
            children: null
        },
        {
            key: '7',
            label: 'time per call',
            children: null
        },
        {
            key: '8',
            label: 'percentage',
            children: null
        },
    ], []);

    const setBarChartItems = useCallback((stack) => {
        let tempItems = BarChartItems;
        tempItems[0].children = stack?.funcname;
        tempItems[1].children = stack?.filename;
        tempItems[2].children = stack?.lineno;
        tempItems[3].children = stack?.total_time;
        tempItems[4].children = stack?.primitive_calls;
        tempItems[5].children = stack?.total_calls;
        tempItems[6].children = stack?.time_per_call;
        tempItems[7].children = stack?.percentage;
        // console.log(stack)
        return tempItems;
    }, []);

    const BarChartContent = useCallback(() => {
        return (
            <Descriptions
                title="Detail"
                layout="vertical"
                bordered
                items={setBarChartItems(eventContent)}
            />
        )
    }, [eventContent]);

    const CascadeTreemapItems = useMemo(() => [
        {
            key: '1',
            label: 'function name',
            children: null,
        },
        {
            key: '2',
            label: 'file name',
            children: null,
        },
        {
            key: '3',
            label: 'start time',
            children: null,
        },
        {
            key: '4',
            label: 'end time',
            children: null,
        },
        {
            key: '5',
            label: 'duration',
            children: null,
        },
        {
            key: '6',
            label: 'level',
            children: null,
        }
    ], []);

    const setCascadeTreemapItems = useCallback((stack) => {
        let tempItems = CascadeTreemapItems;
        tempItems[0].children = stack?.name.split(' ')[0];
        tempItems[1].children = stack?.name.split(' ')[1];
        tempItems[2].children = stack?.st;
        tempItems[3].children = stack?.et;
        tempItems[4].children = stack?.dur;
        tempItems[5].children = stack?.level;
        return tempItems;
    }, [])

    const CascadeTreemapContent = useCallback(() => {
        return (
            <Descriptions
                title="Detail"
                layout="vertical"
                bordered
                items={setCascadeTreemapItems(eventContent)}
            />
        )
    }, [eventContent]);



    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();


    if (parentPlot === 'Icicle') {
        return (
            <div>

            </div>
        )
    } else if (parentPlot === 'BarChart') {
        return (
            <div>
                <BarChartContent/>
            </div>
        )
    } else if (parentPlot === 'CascadeTreemap') {
        return (
            <div>
                <CascadeTreemapContent />
            </div>
        )
    }
}

export {PopoverContent};
