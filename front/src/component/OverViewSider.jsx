import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Card, Col, Row, Statistic} from "antd";

function OverViewSider() {
    const reactiveEvent = useSelector(state => state.reactive.overview);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const siderLayout = {
        // padding + 2 * offset + width = dimension.width
        // paddingLeft: dimension.width * 0.1 / 2
        // paddingTop: 1
        x: dimension.width * 0.12 / 2 + 5,
        y: 20,
        width: dimension.width * 0.9,
        height: dimension.height - 30,
        offsetX: 5,
        offsetY: 5
    }

    // const siderBackgroundLayout = {
    //     left: siderLayout.x + siderLayout.offsetX,
    //     top: siderLayout.y - siderLayout.offsetY,
    //     width: siderLayout.width + 4,
    //     height: siderLayout.height
    // }
    //
    // const siderComponentLayout = {
    //     left: siderLayout.x - siderLayout.offsetX,
    //     top: siderLayout.y + siderLayout.offsetY,
    //     width: siderLayout.width,
    //     height: siderLayout.height
    // }

    const sliceStr = useCallback((str) => {
        if (str === undefined) {
            return;
        }
        var position = str.indexOf('(');
        if (position === -1) {
            return str;
        }
        return str.substring(0, position);
    }, []);

    useLayoutEffect(() => {
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }
    }, [])

    return (
        <div
            id="sider"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{width: '100%'}}
                    >
                        <Statistic
                            title="Function Name"
                            value={
                                sliceStr(reactiveEvent.hover.stack?.name)
                            }
                        >

                        </Statistic>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{width: '100%'}}
                    >
                        <Statistic
                            title="PID"
                            value={reactiveEvent.hover.stack?.pid}
                        >

                        </Statistic>
                        <Statistic
                            title="TID"
                            value={reactiveEvent.hover.stack?.tid}
                        >
                        </Statistic>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{width: '100%'}}
                    >
                        <Statistic
                            title="Start"
                            value={reactiveEvent.hover.stack?.st}
                            precision={2}
                        >
                        </Statistic>
                        <Statistic
                            title="Duration"
                            value={reactiveEvent.hover.stack?.value}
                        >
                        </Statistic>
                    </Card>
                </Col>
            </Row>
            {/*<div*/}
            {/*    className="sider-background"*/}
            {/*    style={{*/}
            {/*        ...siderBackgroundLayout,*/}
            {/*        position: "absolute",*/}
            {/*        backgroundColor: "#000",*/}

            {/*    }}*/}
            {/*>*/}
            {/*</div>*/}
            {/*<div*/}
            {/*    className="sider-component"*/}
            {/*    style={{*/}
            {/*        ...siderComponentLayout,*/}
            {/*        position: "absolute",*/}
            {/*        border: "2px solid #999",*/}
            {/*        backgroundColor: "#FFF",*/}
            {/*    }}*/}
            {/*>*/}
            {/*</div>*/}
        </div>
    )
}

export {OverViewSider};
