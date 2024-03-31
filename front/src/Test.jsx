import {Icicle} from "./plot/Icicle.jsx";
import {ViewBox} from "./plot/ViewBox.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";

const data = [10, 30, 50, 60];

function Test() {

    return (
        <>
            {/*<Icicle data={stackData.stackevents} />*/}
            <Icicle data={listData.stackevents}/>
            <ViewBox />
        </>
    )
}

export {Test};
