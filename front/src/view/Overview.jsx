import {Provider} from "react-redux";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useSafeState} from "ahooks";

import {Timeline} from '../component/Timeline.jsx';

import {hoverStore, selectStack, unselectStack} from "../store/hoverStore.js";

import "../less/main.less";
import {Sider} from "../component/Sider.jsx";
import {Content} from "../component/Content.jsx";


const style = {
    background: '#D9E8F5',
    height: '100%'
};

function Overview({data}) {
    const [selection, setSelection] = useSafeState('stack');

    return (
        <Provider store={hoverStore}>
            <Row gutter={[0, 0]}>
                <Col className="overview-header" id="overview-header" span={24}>
                    <Timeline />
                </Col>
                <Col className="overview-sider" id="overview-sider" span={5}>
                    <Sider />
                </Col>
                <Col className="overview-main" id="overview-content" span={19}>
                    <Content />
                </Col>
                <Col className="overview-footer" id="overview-footer" span={24}>
                    <div style={style}>col-6</div>
                </Col>
            </Row>
        </Provider>
    )
}

export {Overview};
