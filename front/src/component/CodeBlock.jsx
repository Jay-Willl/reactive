import {useState, useLayoutEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import SyntaxHighlighter from "react-syntax-highlighter";
import {atomDark} from "react-syntax-highlighter/dist/esm/styles/prism";
import atomOneLight from "react-syntax-highlighter/src/styles/hljs/atom-one-light.js";

function CodeBlock({data}) {
    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const codeLayout = {
        x: 0,
        y: 10,
        width: dimension.width * 0.85,
        height: dimension.height - 10,
        offsetX: 5,
        offsetY: 5
    }

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
                <SyntaxHighlighter
                    style={{...atomOneLight, fontSize: '6px'}}
                    wrapLines={true}
                >
                    {data.files.code[0]}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export {CodeBlock};
