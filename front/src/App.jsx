import {Provider} from "react-redux";
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import {OverView} from "./view/OverView.jsx";
import {UploadView} from "./view/UploadView.jsx";


import {reactiveStore} from "./store/store.js";
import {MultiView} from "./view/MultiView.jsx";
import {BarChart} from "./plot/BarChart.jsx";

import {statsData} from "./data/statsData.js";
import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";
import {CascadeTreemap} from "./plot/CascadeTreemap.jsx";


function App() {

    return (
        <Provider store={reactiveStore}>
            <CascadeTreemap data={stackData.stackevents} />
            <BarChart data={statsData.statsview} />
            {/*<MultiView />*/}
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
