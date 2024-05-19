import {useMemo, useCallback} from "react";
import {Descriptions} from "antd";
import {useDispatch, useSelector} from "react-redux";

function PopoverContent({parentPlot, eventcontent}) {
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

    const Content = useCallback(() => {
        return (
            <Descriptions
                title="Detail"
                layout="vertical"
                bordered
                items={setBarChartItems(eventcontent)}
                style={{
                    pointerEvents: 'none'
                }}
            />
        )
    }, [eventcontent]);

    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();


    if (parentPlot === 'Icicle') {
        return (
            <div>

            </div>
        )
    } else if (parentPlot === 'BarChart') {
        return (
            <div
                style={{
                    pointerEvents: "none"
                }}
            >
                <Content/>
            </div>
        )
    } else if (parentPlot === 'CascadeTreemap') {
        return (
            <div>

            </div>
        )
    }
}

export {PopoverContent};
