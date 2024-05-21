import {useMemo, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Descriptions, Row, Col, Space} from "antd";

function PopoverContent({parentPlot, eventContent, followContent}) {
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
            <>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Descriptions
                            title="Selected"
                            layout="vertical"
                            bordered
                            items={setBarChartItems(eventContent)}
                            size="small"
                        />
                    </Col>
                    <Col span={12}>
                        <Descriptions
                            title="Followed"
                            layout="vertical"
                            bordered
                            items={setBarChartItems(followContent)}
                            size="small"
                        />
                    </Col>
                </Row>
            </>
        )
    }, [eventContent, followContent]);

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
            <>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Descriptions
                            title="Selected"
                            layout="vertical"
                            bordered
                            items={setCascadeTreemapItems(eventContent)}
                        />
                    </Col>
                    <Col span={12}>
                        <Descriptions
                            title="Follow"
                            layout="vertical"
                            bordered
                            items={setCascadeTreemapItems(followContent)}
                        />
                    </Col>
                </Row>
            </>

        )
    }, [eventContent, followContent]);

    const IcicleItems = useMemo(() => [
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
            label: 'pid',
            children: null,
        },
        {
            key: '7',
            label: 'tid',
            children: null,
        },
    ], [eventContent]);

    const setIcicleItems = useCallback((stack) => {
        let tempItems = IcicleItems;
        tempItems[0].children = stack?.name.split(' ')[0];
        tempItems[1].children = stack?.name.split(' ')[1];
        tempItems[2].children = stack?.st;
        tempItems[3].children = stack?.et;
        tempItems[4].children = stack?.dur;
        tempItems[5].children = stack?.pid;
        tempItems[6].children = stack?.tid;
        return tempItems;
    }, []);

    const IcicleContent = useCallback(() => {
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Descriptions
                            title="Event Detail"
                            layout="vertical"
                            bordered
                            items={setIcicleItems(eventContent)}
                        />
                    </Col>
                </Row>
            </>
        )
    }, [eventContent]);

    if (parentPlot === 'Icicle') {
        // console.log(eventContent)
        return (
            <div>
                <IcicleContent />
            </div>
        )
    } else if (parentPlot === 'BarChart') {
        return (
            <div>
                <BarChartContent />
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
