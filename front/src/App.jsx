import {Provider} from "react-redux";
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import {OverView} from "./view/OverView.jsx";
import {UploadView} from "./view/UploadView.jsx";
import {MultiView} from "./view/MultiView.jsx";
import {CollectionView} from "./view/CollectionView.jsx";

import {reactiveStore} from "./store/store.js";
import {BarChart} from "./plot/BarChart.jsx";
import {CascadeTreemap} from "./plot/CascadeTreemap.jsx";

import {sample} from "./data/sample_numpy.js";
import {MultiViewContent} from "./component/MultiViewContent.jsx";

function App() {

    return (
        <Provider store={reactiveStore}>
            {/*<CascadeTreemap data={sample.stackview}/>*/}
            {/*<BarChart data={sample.statsview}/>*/}
            <MultiView />
            {/*<CollectionView />*/}
            {/*<OverView />*/}


            <Router>
                <div>
                    <Routes>
                        <Route path="/upload" element={<UploadView/>}/>
                        {/*<Route path="/upload" element={<TestUploadView/>}/>*/}
                        <Route path="/" element={<OverView />}/>
                    </Routes>
                </div>
            </Router>
        </Provider>
    )
}

export default App;
