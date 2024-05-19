import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Flex, Button, Select, Row, Col} from "antd";

import {reactiveStore, editDisplayedPlotMultiView} from "../store/store.js";

function MultiViewFooter() {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();
    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const handleDisplayedPlot = (value) => {
        dispatch(editDisplayedPlotMultiView(value));
    }

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
        <div
            id="content"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <Row>
                <Col span={8}>
                    <Flex gap="small" wrap="wrap">
                        <Button type="text" style={{ float: 'right' }}>Exit</Button>
                    </Flex>
                </Col>
                <Col span={8} offset={8}>
                    <Flex gap="small" wrap="wrap">
                        <Select
                            defaultValue="BarChart"
                            style={{
                                width: 160,
                            }}
                            onChange={handleDisplayedPlot}
                            options={[
                                {
                                    value: 'BarChart',
                                    label: 'BarChart',
                                },
                                {
                                    value: 'CascadeTreemap',
                                    label: 'CascadeTreemap',
                                },
                            ]}
                        />
                    </Flex>
                </Col>
            </Row>
        </div>
    )
}

export {MultiViewFooter};
