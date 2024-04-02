import {Test} from "./Test.jsx";
import {Overview} from "./view/Overview.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";


function App() {

    return (
        <Overview
            stackData={stackData}
            listData={listData}
        />
        // <Test />
    )
}

export default App;
