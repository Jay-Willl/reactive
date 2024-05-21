import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import '../less/main.less';

import {Radial} from "../plot/Radial.jsx";
import {ScatterPlot} from "../plot/ScatterPlot.jsx";

import {sample} from "../data/sample.js";

function CollectionViewContent() {
    const reactiveEvent = useSelector(state => state.reactive.collectionview);
    const dispatch = useDispatch();
    const divRef = useRef(null);

    const CollectionViewCell = useCallback(({displayedPlot, data, layout}) => {
        if (displayedPlot === 'Radial') {
            return (
                <div
                    id="collectionview-micro"
                    className="collectionview-micro"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Radial data={sample.stackview} />
                </div>
            )
        } else if (displayedPlot === 'ScatterPlot') {
            return (
                <div
                    id="collectionview-micro"
                    className="collectionview-micro"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <ScatterPlot data={sample.statsview} />
                </div>
            )
        }
    }, [reactiveEvent.config]);

    const Temp = useCallback(() => {
        return (
            <Row
                gutter={[0, 0]}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Col span={24} id="collectionview-cell" className="collectionview-cell">
                    <CollectionViewCell
                        displayedPlot={reactiveEvent.config.displayedPlot}
                    />
                </Col>
            </Row>
        )
    }, [reactiveEvent.config]);

    return (
        <Temp />
    )
}

export {CollectionViewContent}
