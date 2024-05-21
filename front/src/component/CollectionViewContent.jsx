import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import '../less/main.less';

import {Radial} from "../plot/Radial.jsx";
import {ScatterPlot} from "../plot/ScatterPlot.jsx";

import {sample} from "../data/sample.js";

function CollectionViewContent() {
    const reactiveEvent = useSelector(state => state.reactive.multiview);
    const dispatch = useDispatch();
    const divRef = useRef(null);

    const CollectionViewCell = useCallback(({displayedPlot, data, layout}) => {
        if (displayedPlot === 'Radial') {
            return (
                <div>

                </div>
            )
        } else if (displayedPlot === 'ScatterPlot') {
            return (
                <div>

                </div>
            )
        }
    }, [reactiveEvent.config]);

    const Temp = useCallback(() => {
        return (
            <Row>

            </Row>
        )
    }, [reactiveEvent.config]);

    return (
        <Temp />
    )
}

export {CollectionViewContent}
