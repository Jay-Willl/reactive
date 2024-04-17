import hljs from "highlight.js";
import {useState, useEffect, useLayoutEffect, useRef} from "react";

import 'highlight.js/styles/default.css';


function CodeBlock({data}) {
    const divRef = useRef(null);
    const codeRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const codeLayout = {
        x: 0,
        y: 10,
        width: dimension.width * 0.85,
        height: dimension.height - 10,
        offsetX: 5,
        offsetY: 5
    }

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
            hljs.highlightAll();
        }
    }, [data]);

    useLayoutEffect(() => {
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }
    }, []);

    return (
        <div
            id="codeblock"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <div
                id="highlight"
                style={codeLayout}
            >
                <pre>
                    <code ref={codeRef} className={`language-python`}>
                        {data}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export {CodeBlock};
