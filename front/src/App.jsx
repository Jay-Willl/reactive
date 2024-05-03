import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import {Test} from "./Test.jsx";
import {OverView} from "./view/OverView.jsx";
import {UploadView} from "./view/UploadView.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";


function App() {

    return (
        <Router>
            <div>
                {/*<nav>*/}
                {/*    <ul>*/}
                {/*        <li>*/}
                {/*            <Link to="/">Home</Link>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <Link to="/upload">Upload File</Link>*/}
                {/*        </li>*/}
                {/*    </ul>*/}
                {/*</nav>*/}
                <Routes>
                    <Route path="/upload" element={<UploadView />} />
                    <Route path="/" element={<OverView listData={listData} stackData={stackData} />} />
                </Routes>
            </div>
        </Router>
    // <Router>
    //     <Routes>
    //         <Route path="/" element={<UploadView />}/>
    //         <Route path="/result" />
        //
        //     </Routes>
        // </Router>

        // <UploadView />
        // <OverView stackData={stackData} listData={listData} />
        // <Test />
    )
}

export default App;
