import {Test} from "./Test.jsx";
import {OverView} from "./view/OverView.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";


function App() {

    return (
        // <Router>
        //     <Routes>
        //         <Route path="/" element={<UploadView />}/>
        //         <Route path="/result" />
        //
        //     </Routes>
        // </Router>

        // <UploadView />
        <OverView stackData={stackData} listData={listData} />
        // <Test />
    )
}

export default App;
