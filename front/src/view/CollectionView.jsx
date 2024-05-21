import {Col, Row} from "antd";

import {Radial} from "../plot/Radial.jsx";
import {ScatterPlot} from "../plot/ScatterPlot.jsx";

import {sample} from "../data/sample.js";

function CollectionView() {

    return (
        <Row gutter={[0, 0]}>
            <Col className="collectionview-cell" id="collectionview-cell-1" span={24}>
                <ScatterPlot data={sample.statsview}/>
            </Col>
            {/*<Col className="collectionview-cell" id="collectionview-cell-1" span={24}>*/}
            {/*    <Radial data={sample.stackview}/>*/}
            {/*</Col>*/}
        </Row>
    )
}

export {CollectionView};
