import {Icicle} from "./plot/Icicle.jsx";
import {ViewBox} from "./plot/ViewBox.jsx";
import {CodeBlock} from "./component/CodeBlock.jsx";
import {Tooltip} from "./component/Tooltip.jsx";

import {stackData} from "./data/stackData.js";
import {listData} from "./data/listData.js";

const data = [10, 30, 50, 60];

function TestTooltip() {
    return (
        <div>
            <Tooltip text="这是一个提示">
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
                <button>鼠标悬停看提示</button>
            </Tooltip>
        </div>
    );

}

function Test() {

    return (
        <>
            {/*<Icicle data={stackData.stackevents} />*/}
            {/*<Icicle data={listData.stackevents}/>*/}
            {/*<TestTooltip />*/}
            {/*<CodeBlock data={listData.files.code[0]}/>*/}
        </>
    )
}

export {Test};
