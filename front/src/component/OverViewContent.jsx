import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";

import {Icicle} from "../plot/Icicle.jsx";

function OverViewContent({listData}) {
    const reactiveEvent = useSelector(state => state.reactive.overview);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const contentLayout = useMemo(() => {
        return {
            // paddingLeft: dimension.width * 0.1 / 2
            // paddingTop: 1
            x: dimension.width * 0.05 / 2 + 5,
                y: 20,
            width: dimension.width * 0.95,
            height: dimension.height - 30,
            offsetX: 5,
            offsetY: 5
        }
    }, [dimension]);

    const contentBackgroundLayout = useMemo(() => {
        return {
            left: contentLayout.x + contentLayout.offsetX,
            top: contentLayout.y - contentLayout.offsetY,
            width: contentLayout.width + 4,
            height: contentLayout.height
        }
    }, [dimension]);

    const contentComponentLayout = useMemo(() => {
        return {
            left: contentLayout.x - contentLayout.offsetX,
            top: contentLayout.y + contentLayout.offsetY,
            width: contentLayout.width,
            height: contentLayout.height
        }
    }, [dimension]);

    // console.log(contentComponentLayout);

    useLayoutEffect(() => {
        // console.log("content layout effect");
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }
    }, [])

    return (
        <div
            id="content"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <Icicle data={listData} layout={contentComponentLayout}/>
            {/*<div*/}
            {/*    className="content-background"*/}
            {/*    style={{*/}
            {/*        ...contentBackgroundLayout,*/}
            {/*        position: "absolute",*/}
            {/*        backgroundColor: "#000",*/}
            {/*    }}*/}
            {/*>*/}
            {/*</div>*/}
            {/*<div*/}
            {/*    className="content-component"*/}
            {/*    style={{*/}
            {/*        ...contentComponentLayout,*/}
            {/*        position: "absolute",*/}
            {/*        border: "2px solid #999",*/}
            {/*        backgroundColor: "#FFF",*/}
            {/*    }}*/}
            {/*>*/}
            {/*</div>*/}
        </div>
    )
}

export {OverViewContent};
