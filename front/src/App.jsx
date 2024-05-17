import {Provider} from "react-redux";
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import {OverView} from "./view/OverView.jsx";
import {UploadView} from "./view/UploadView.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";
import {reactiveStore} from "./store/store.js";


function App() {

    return (
        <Provider store={reactiveStore}>
            <OverView listData={listData} stackData={stackData} />
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
