import {Col, Row} from "antd";

import {CollectionViewContent} from "../component/CollectionViewContent.jsx";
import {CollectionViewFooter} from "../component/CollectionViewFooter.jsx";


function CollectionView() {



    return (
        <Row gutter={[0, 0]}>
            <Col className="collectionview-content" id="collectionview-content" span={24}>
                <CollectionViewContent />
            </Col>
            <Col className="collectionview-footer" id="collectionview-footer" span={24}>
                <CollectionViewFooter />
            </Col>
        </Row>
    )
}

export {CollectionView};
