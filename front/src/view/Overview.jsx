import {Provider} from "react-redux";
import {useSelector, useDispatch} from "react-redux";
import {Col, Row, Space} from "antd";
import {useSafeState} from "ahooks";

import {hoverStore, selectStack, unselectStack} from "../store/hoverStore.js";
import {rangeStore, editStart, editEnd, editScale} from "../store/rangeStore.js";

import "../less/main.less";
import {Sider} from "../component/Sider.jsx";
import {Content} from "../component/Content.jsx";
import {Timeline} from '../component/Timeline.jsx';
import {Footer} from "../component/Footer.jsx";


function Overview({stackData, listData}) {

    return (
        <Provider store={hoverStore}>
            <Provider store={rangeStore}>
                <Row gutter={[0, 0]}>
                    <Col className="overview-header" id="overview-header" span={24}>
                        <Timeline />
                    </Col>
                    <Col className="overview-sider" id="overview-sider" span={5}>
                        <Sider />
                    </Col>
                    <Col className="overview-main" id="overview-content" span={19}>
                        <Content stackData={stackData} listData={listData}/>
                    </Col>
                    <Col className="overview-footer" id="overview-footer" span={24}>
                        <Footer />
                    </Col>
                </Row>
            </Provider>
        </Provider>
    )
}

export {Overview};
