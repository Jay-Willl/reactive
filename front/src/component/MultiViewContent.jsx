import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import '../less/main.less';

import {CascadeTreemap} from "../plot/CascadeTreemap.jsx";
import {BarChart} from "../plot/BarChart.jsx";

import {sample} from "../data/sample.js";


function MultiViewCell({pos, displayedPlot, data, layout}) {
    if (pos === 0) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <CascadeTreemap data={sample.stackview} />
            </div>
        )
    } else {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <BarChart data={sample.statsview}/>
            </div>
        )
    }

    // if (displayedPlot === 'CascadeTreeMap') {
    //     return (
    //         <div
    //             id="multiview-cell-1"
    //             className="multiview-cell"
    //             style={{
    //                 width: "100%",
    //                 height: "100%",
    //             }}
    //         >
    //             <CascadeTreemap data={stackData.stackevents} />
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div
    //             id="multiview-cell-2"
    //             className="multiview-cell"
    //             style={{
    //                 width: "100%",
    //                 height: "100%",
    //             }}
    //         >
    //             <BarChart data={statsData.statsview}/>
    //         </div>
    //     )
    // }
}


function MultiViewContent() {
    const reactiveEvent = useSelector(state => state.reactive.multiview);
    const dispatch = useDispatch();
    const divRef = useRef(null);

    return (
        <Row
            gutter={[0, 0]}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <Col span={12} id="multiview-cell-1"
                 className="multiview-cell">
                <MultiViewCell
                    pos={0}
                    displayedPlot={reactiveEvent.config.displayedPlot}
                />
            </Col>
            <Col span={12} id="multiview-cell-2"
                 className="multiview-cell">
                <MultiViewCell
                    pos={1}
                    displayedPlot={reactiveEvent.config.displayedPlot}
                />
            </Col>
        </Row>
    )
}

export {MultiViewContent};
