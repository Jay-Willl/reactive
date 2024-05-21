import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Card, Col, Row} from "antd";
import {Timeline} from "./Timeline.jsx";

function OverViewHeader() {


    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative"
            }}
        >
            <Row gutter={[0, 0]} >
                <Col
                    span={24}
                    className="overview-header-info"
                >
                    <Timeline />
                </Col>
            </Row>
        </div>
    )
}

export {OverViewHeader};
