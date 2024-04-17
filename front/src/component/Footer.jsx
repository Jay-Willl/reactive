import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Flex, Button, Select, Row, Col} from "antd";

import {editIcicleColor, editDisplayedPlot} from "../store/store.js";


function Footer() {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();
    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const handleDisplayedPlot = (value) => {
        dispatch(editDisplayedPlot(value));
    }

    const handleIcicleColor = (value) => {
        dispatch(editIcicleColor(value));
    }

    useLayoutEffect(() => {
        // console.log("content layout effect");
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
                            defaultValue="Icicle"
                            style={{
                                width: 160,
                            }}
                            onChange={handleDisplayedPlot}
                            options={[
                                {
                                    value: 'Icicle',
                                    label: 'Icicle',
                                },
                                {
                                    value: 'Cascade Treemap',
                                    label: 'Cascade Treemap',
                                },
                                {
                                    value: 'Radial',
                                    label: 'Radial',
                                },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                },
                            ]}
                        />
                        <Select
                            defaultValue="lucy"
                            style={{
                                width: 200,
                            }}
                            onChange={handleIcicleColor}
                            options={[
                                {
                                    label: <span>manager</span>,
                                    title: 'manager',
                                    options: [
                                        {
                                            label: <span>Jack</span>,
                                            value: 'Jack',
                                        },
                                        {
                                            label: <span>Lucy</span>,
                                            value: 'Lucy',
                                        },
                                    ],
                                },
                                {
                                    label: <span>engineer</span>,
                                    title: 'engineer',
                                    options: [
                                        {
                                            label: <span>Chloe</span>,
                                            value: 'Chloe',
                                        },
                                        {
                                            label: <span>Lucas</span>,
                                            value: 'Lucas',
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Flex>
                </Col>
            </Row>
        </div>
    )
}

export {Footer};
