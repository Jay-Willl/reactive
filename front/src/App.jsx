import {Provider} from "react-redux";
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import {OverView} from "./view/OverView.jsx";
import {UploadView} from "./view/UploadView.jsx";
import {MultiView} from "./view/MultiView.jsx";

import {reactiveStore} from "./store/store.js";
import {BarChart} from "./plot/BarChart.jsx";
import {CascadeTreemap} from "./plot/CascadeTreemap.jsx";

import {sample} from "./data/sample.js";
import {MultiViewContent} from "./component/MultiViewContent.jsx";
import {listData} from "./data/listData.js";
import {stackData} from "./data/stackData.js";

function App() {

    return (
        <Provider store={reactiveStore}>
            {/*<CascadeTreemap data={sample.stackview}/>*/}
            {/*<BarChart data={sample.statsview}/>*/}
            {/*<MultiView />*/}
            <OverView listData={listData} stackData={stackData} />

            {/*<OverView listData={listData} stackData={stackData} />*/}
            {/*<Router>*/}
            {/*    <div>*/}
            {/*        <Routes>*/}
            {/*            <Route path="/upload" element={<UploadView/>}/>*/}
            {/*            /!*<Route path="/upload" element={<TestUploadView/>}/>*!/*/}
            {/*            <Route path="/" element={<OverView listData={listData} stackData={stackData}/>}/>*/}
            {/*        </Routes>*/}
            {/*    </div>*/}
            {/*</Router>*/}
        </Provider>
    )
}

export default App;
