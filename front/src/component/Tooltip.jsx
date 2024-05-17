import {useCallback, useLayoutEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";

import {CodeBlock} from "./CodeBlock.jsx";

function Tooltip({children}) {
    const hoverEvent = useSelector(state => state.reactive.overview);
    console.log(hoverEvent);

    if (!hoverEvent) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            padding: '10px',
            background: 'orange',
            borderRadius: '5px',
            color: 'white',
        }}>
            {hoverEvent.stack.name}
        </div>
    );
}

export {Tooltip};
