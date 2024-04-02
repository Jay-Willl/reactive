import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";

function Sider() {
    const hoverEvent = useSelector(state => state.hover);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const siderLayout = {
        // padding + 2 * offset + width = dimension.width
        // paddingLeft: dimension.width * 0.1 / 2
        // paddingTop: 1
        x: dimension.width * 0.12 / 2 + 5,
        y: 20,
        width: dimension.width * 0.9,
        height: dimension.height - 30,
        offsetX: 5,
        offsetY: 5
    }

    const siderBackgroundLayout = {
        left: siderLayout.x + siderLayout.offsetX,
        top: siderLayout.y - siderLayout.offsetY,
        width: siderLayout.width + 4,
        height: siderLayout.height
    }

    const siderComponentLayout = {
        left: siderLayout.x - siderLayout.offsetX,
        top: siderLayout.y + siderLayout.offsetY,
        width: siderLayout.width,
        height: siderLayout.height
    }

    // console.log(siderLayout);
    // console.log(siderBackgroundLayout);
    // console.log(siderComponentLayout);

    useLayoutEffect(() => {
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
            id="sider"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <div
                className="sider-background"
                style={{
                    ...siderBackgroundLayout,
                    position: "absolute",
                    backgroundColor: "#000",

                }}
            >
            </div>
            <div
                className="sider-component"
                style={{
                    ...siderComponentLayout,
                    position: "absolute",
                    border: "2px solid #999",
                    backgroundColor: "#FFF",
                }}
            >

            </div>
        </div>
    )
}

export {Sider};
