import {useEffect} from "react";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import {MultiViewFooter} from "../component/MultiViewFooter.jsx";
import {MultiViewContent} from "../component/MultiViewContent.jsx";

function MultiView(){
    const [result, setResult, getResult] = useGetState({});
    useEffect(() => {
        const result = localStorage.getItem('result');
        if (result) {
            setResult(JSON.parse(result));
        }

        const interval = setInterval(() => {
            console.log('result: ', getResult());
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <Row gutter={[0, 0]}>
            <Col className="multiview-content" id="multiview-content">
                <MultiViewContent />
            </Col>
            <Col className="multiview-footer" id="multiview-footer">
                <MultiViewFooter />
            </Col>
        </Row>
    )
}

export {MultiView};
