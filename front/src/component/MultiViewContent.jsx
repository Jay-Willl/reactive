import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import '../less/main.less';

import {CascadeTreemap} from "../plot/CascadeTreemap.jsx";
import {BarChart} from "../plot/BarChart.jsx";

import {sample_2_28} from "../data/sample_2_28.js";
import {sample_2_32} from "../data/sample_2_32.js";


function MultiViewContent() {
    const reactiveEvent = useSelector(state => state.reactive.multiview);
    const dispatch = useDispatch();
    const divRef = useRef(null);

    const MultiViewCell = useCallback(({pos, displayedPlot, data, layout}) => {
        if (pos === -1) {
            return (
                <div
                    id="multiview-micro-1"
                    className="multiview-micro"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >

                </div>
            )
        }
        if (displayedPlot === 'CascadeTreemap') {
            return (
                <div
                    id="multiview-micro-1"
                    className="multiview-micro"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <CascadeTreemap data={sample.stackview}/>
                </div>
            )
        } else if (displayedPlot === 'BarChart') {
            if (pos === 0) {
                return (
                    <div
                        id="multiview-micro-2"
                        className="multiview-micro"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <BarChart data={sample_2_28.statsview}/>
                    </div>
                )
            } else {
                return (
                    <div
                        id="multiview-micro-2"
                        className="multiview-micro"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <BarChart data={sample_2_32.statsview}/>
                    </div>
                )
            }
        }
    }, [reactiveEvent.config]);

    const Temp = useCallback(() => {
        return (
            <Row
                gutter={[0, 0]}
            >
                {/*<Col span={24} id="multiview-cell-0"*/}
                {/*     className="multiview-cell">*/}
                {/*    <MultiViewCell*/}
                {/*        pos={-1}*/}
                {/*    />*/}
                {/*</Col>*/}
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
    }, [reactiveEvent.config]);

    return (
        <Temp/>
    )
}

export {MultiViewContent};
