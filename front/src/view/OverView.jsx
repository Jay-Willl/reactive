import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import {OverViewHeader} from "../component/OverViewHeader.jsx";
import {OverViewContent} from "../component/OverViewContent.jsx";
import {OverViewFooter} from "../component/OverViewFooter.jsx";

import {sample} from "../data/sample_numpy.js";

import "../less/main.less";



function OverView({data}) {
    const [result, setResult, getResult] = useGetState({});

    useEffect(() => {
        const result = localStorage.getItem('result');
        if (result) {
            setResult(JSON.parse(result));
        }

        // const interval = setInterval(() => {
        //     console.log('result: ', getResult());
        // }, 3000);
        //
        // return () => {
        //     clearInterval(interval);
        // };
    }, []);

    return (
            <Row gutter={[0, 0]}>
                <Col className="overview-header" id="overview-header" span={24}>
                    <OverViewHeader />
                </Col>
                {/*<Col className="overview-sider" id="overview-sider" span={5}>*/}
                {/*    <OverViewSider/>*/}
                {/*</Col>*/}
                <Col className="overview-content" id="overview-content" span={24}>
                    {/*<OverViewContent listData={listData.stackevents}/>*/}
                    <OverViewContent listData={sample.listview}/>
                </Col>
                <Col className="overview-footer" id="overview-footer" span={24}>
                    <OverViewFooter/>
                </Col>
            </Row>
    )
}

export {OverView};
