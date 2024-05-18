import {Descriptions} from "antd";
import {useDispatch, useSelector} from "react-redux";

import {reactiveStore} from "../store/store.js";


const BarChartItems = [
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
]

const setBarChartItems = (stack) => {
    let tempItems = BarChartItems;
    tempItems[0].children = stack.funcname;
    tempItems[1].children = stack.filename;
    tempItems[2].children = stack.lineno;
    tempItems[3].children = stack.total_time;
    tempItems[4].children = stack.primitive_calls;
    tempItems[5].children = stack.total_calls;
    tempItems[6].children = stack.time_per_call;
    tempItems[7].children = stack.percentage;
    return tempItems;
}


function PopoverContent({parentPlot}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    if (parentPlot === 'Icicle') {
        return (
            <div>
                <Descriptions
                    title="Detail"
                    layout="vertical"
                    bordered
                    items={setBarChartItems(reactiveStore.getState().reactive.multiview.hover.stack)}
                />
            </div>
        )
    } else if (parentPlot === 'BarChart') {
        return (
            <div>

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
