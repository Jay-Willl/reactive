import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import {CascadeTreemap} from "../plot/CascadeTreemap.jsx";
import {BarChart} from "../plot/BarChart.jsx";


function MultiViewCell(pos, displayedPlot, data, layout) {

    if (displayedPlot === 'CascadeTreeMap') {
        return <CascadeTreemap/>
    } else if (displayedPlot === 'BarChart') {
        return <BarChart/>
    }

}


function MultiViewContent() {
    const reactiveEvent = useSelector(state => state.reactive.multiview);
    const dispatch = useDispatch();
    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    useLayoutEffect(() => {
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }

    }, []);

    return (
        <Row gutter={[0, 0]}>
            <Col span={12}>
                <MultiViewCell pos={0} displayedPlot={reactiveEvent.config.displayedPlot}/>
            </Col>
            <Col span={12}>
                <MultiViewCell pos={1} displayedPlot={reactiveEvent.config.displayedPlot}/>
            </Col>
        </Row>
    )
}

export {MultiViewContent};
