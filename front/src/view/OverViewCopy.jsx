import {useEffect} from "react";
import {Provider} from "react-redux";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useGetState} from "ahooks";

import {reactiveStore} from "../store/store.js";

import "../less/main.less";
import {Sider} from "../component/Sider.jsx";
import {Content} from "../component/Content.jsx";
import {Timeline} from '../component/Timeline.jsx';
import {Footer} from "../component/Footer.jsx";


function OverView({stackData, listData}) {
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
        <Provider store={reactiveStore}>
            <Row gutter={[0, 0]}>
                <Col className="overview-header" id="overview-header" span={24}>
                    <Timeline/>
                </Col>
                <Col className="overview-sider" id="overview-sider" span={5}>
                    <Sider/>
                </Col>
                <Col className="overview-main" id="overview-content" span={19}>
                    <Content stackData={stackData} listData={listData}/>
                </Col>
                <Col className="overview-footer" id="overview-footer" span={24}>
                    <Footer/>
                </Col>
            </Row>
        </Provider>
    )
}

export {OverView};
