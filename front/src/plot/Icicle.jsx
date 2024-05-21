import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useUpdateLayoutEffect, useCreation} from "ahooks";
import {useDispatch, useSelector} from "react-redux";

import {reactiveStore} from "../store/store.js";
import {editStart, editEnd, editScale, selectStackOverView, unselectStackOverView} from "../store/store.js";
import {Popover} from "antd";
import {PopoverContent} from "../component/PopoverContent.jsx";

/**
 * Bidirectional translation:
 *      1. event control -> (setViewBoxVal) -> updateHoverEvent -> redraw Timeline component
 *      2. timeline component control -> updateHoverEvent -> (setViewBoxVal)
 */

function Icicle({data, layout}) {
    const reactiveEvent = useSelector(state => state.reactive.overview);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const metadata = useRef(
        {
            currentBox: {},
            totalBox: {
                level: 0,
                width: 0
            },
            ogData: {
                st: 0,
                et: 0,
            }
        }
    );

    const [visible, setVisible] = useState(false);
    const [eventContent, setEventContent] = useState(null);

    const colorScheme = useCreation(() => {
        return {
            blues: d3.schemeBlues,
            greens: d3.schemeGreens,
            greys: d3.schemeGreys,
            oranges: d3.schemeOranges,
            purples: d3.schemePurples,
            reds: d3.schemeReds,
        }
    });

    const translateScale = useCreation(() => {
        // input: scale in rangeEvent
        // output: real svg scale
        return (scale) => 1 - 0.01 * (Math.pow(10, scale * 2));
    }, []);

    // input: current ViewBox and total ViewBox parameter
    // output: start and end percentage, corresponding to rangeEvent(start, end)
    // called after every event control, used to update timeline component
    const currentBox2range = useCreation(() => {
        return (currentBox, totalBox) => {
            let startPercentage = currentBox[0] / totalBox.width;
            let endPercentage = (Number(currentBox[0]) + Number(currentBox[2])) / totalBox.width;
            // console.log("currentBox " + currentBox);
            // console.log("totalBox width " + totalBox.width)
            // console.log("percentage " + startPercentage + " " + endPercentage);
            return [startPercentage, endPercentage];
        }
    }, []);

    // input: start and end percentage
    // output: corresponding ViewBox parameter (index 0 & 2)
    const range2currentBox = useCreation(() => {
        return (range, totalBox) => {
            let currentStart = range[0] * totalBox.width / 100;
            let currentEnd = (range[1] * totalBox.width - currentStart) / 100;
            return [currentStart, currentEnd];
        }
    }, []);

    const colorScale = useCreation(() => {
        return d3.scaleOrdinal(d3.schemeTableau10);
    })

    const icicleLayout = useMemo(() => {
        return {
            x: layout.left,
            y: layout.top,
            width: layout.width,
            height: layout.height
        }
    }, [layout]);

    const expectedLayout = useMemo(() => {
        return {
            initRectHeight: layout.height * 0.05,
            minRectHeight: 10,
            maxRectHeight: layout.height * 0.3,
            rectInterval: 1
        }
    }, [layout]);

    const handleRectX = useCallback((st) => {
        return st * 10;
    }, [expectedLayout]);

    const handleRectWidth = useCallback((st, et) => {
        return (et - st) * 10;
    }, [expectedLayout]);

    const handleRectY = useCallback((level) => {
        return level * (expectedLayout.initRectHeight + expectedLayout.rectInterval);
    }, [expectedLayout]);

    const handleRectHeight = useCallback(() => {
        return expectedLayout.initRectHeight;
    }, [expectedLayout]);

    const handleTextX = useCallback((st, et) => {
        return st * 10 + et * 5;
    }, [expectedLayout]);

    const handleTextY = useCallback((level) => {
        return level * (expectedLayout.initRectHeight + expectedLayout.rectInterval) + expectedLayout.initRectHeight / 2;
    }, [expectedLayout]);


    const draw = useCallback(() => {
        const svg = d3.select(svgRef.current);
        const maxLength = d3.max(data.stackevents, d => (d.et - d.st) * 10)
        svgRef.current.setAttribute("viewBox", `0 0 ${maxLength} ${icicleLayout.height}`)
        svgRef.current.setAttribute("preserveAspectRatio", "none")
        metadata.current.currentBox = [0, 0, maxLength, icicleLayout.height];

        svg.selectAll("*").remove();

        // svg.append("plot")
        //     .attr("width", icicleLayout.width)
        //     .attr("height", icicleLayout.height)
        //     .attr("transform", `translate(${icicleLayout.x},${icicleLayout.y})`)

        svg.selectAll("rect")
            .data(data.stackevents)
            .enter()
            .append("rect")
            .attr("x", (d, i) => handleRectX(d.st))
            .attr("y", (d, i) => handleRectY(d.level))
            .attr("width", (d, i) => {
                if (handleRectX(d.st) + handleRectWidth(d.st, d.et) > metadata.current.totalBox.width) {
                    metadata.current.totalBox.width = handleRectX(d.st) + handleRectWidth(d.st, d.et);
                }
                return handleRectWidth(d.st, d.et)
            })
            .attr("height", (d, i) => {
                if (handleRectY(d.level) > metadata.current.totalBox.level) {
                    metadata.current.totalBox.level = d.level;
                }
                return handleRectHeight()
            })
            .style("fill", (d, i) => {
                return colorScale(d.name);
            })

        dispatchRangeChange();

        // svg.selectAll("text")
        //     .data(data.stackevents)
        //     .enter()
        //     .append("text")
        //     .text(d => d.name)
        //     .attr("x", (d, i) => handleRectX(d.st))
        //     .attr("y", (d, i) => handleRectY(d.level))
        //     .attr("fill", "black");
        //
        //
        // data.stackevents.forEach((rect) => {
        //     svg.append("rect")
        //         .attr("x", handleRectX(rect.st))
        //         .attr("y", handleRectY(rect.level))
        //         .attr("width", handleRectWidth(rect.st, rect.et))
        //         .attr("height", handleRectHeight())
        //         .style("fill", () => {
        //             // console.log(rect);
        //             return colorScale(rect.name);
        //         })
        // })

    }, [handleRectX, handleRectWidth, handleRectY, handleRectHeight, icicleLayout]);

    const getViewBoxVal = useCallback(() => {
        return svgRef.current.getAttribute("viewBox").split(' ');
    }, [svgRef]);

    const setViewBoxValWithoutDispatch = useCallback((val, index, str) => {
        if (str === "inc") {
            let viewBox = svgRef.current.getAttribute("viewBox");
            let parts = viewBox.split(' ');
            parts[index] = Number(parts[index]) + val;
            svgRef.current.setAttribute("viewBox", parts.join(' '));
        } else if (str === "abs") {
            let viewBox = svgRef.current.getAttribute("viewBox");
            let parts = viewBox.split(' ');
            parts[index] = val;
            svgRef.current.setAttribute("viewBox", parts.join(' '));
        }
        // console.log(getViewBoxVal());
        metadata.current.currentBox = getViewBoxVal();
    }, [svgRef]);

    const setViewBoxVal = useCallback((val, index, str) => {
        if (str === "inc") {
            let viewBox = svgRef.current.getAttribute("viewBox");
            let parts = viewBox.split(' ');
            parts[index] = Number(parts[index]) + val;
            svgRef.current.setAttribute("viewBox", parts.join(' '));
        } else if (str === "abs") {
            let viewBox = svgRef.current.getAttribute("viewBox");
            let parts = viewBox.split(' ');
            parts[index] = val;
            svgRef.current.setAttribute("viewBox", parts.join(' '));
        }
        metadata.current.currentBox = getViewBoxVal();
        dispatchRangeChange();
    }, [svgRef]);

    const dispatchRangeChange = useCallback(() => {
        let rangeArr = currentBox2range(metadata.current.currentBox, metadata.current.totalBox);
        dispatch(editStart(rangeArr[0] * 100));
        dispatch(editEnd(rangeArr[1] * 100));
        dispatch(editScale((metadata.current.currentBox[2]) / metadata.current.totalBox.width));
        // console.log(metadata.current.currentBox);
    }, [svgRef]);

    const handleOutsideModify = useCallback(() => {
        const currentState = reactiveStore.getState();
        let tempBox = range2currentBox([currentState.reactive.overview.range.start, currentState.reactive.overview.range.end], metadata.current.totalBox);

        setViewBoxValWithoutDispatch(tempBox[0], 0, "abs");
        setViewBoxValWithoutDispatch(tempBox[1] - tempBox[0], 2, "abs");
        // console.log(metadata.current.currentBox)
    }, [svgRef]);

    const handleKey = (event) => {
        // console.log(event);
        event.preventDefault();
        if (event.key === "ArrowLeft") {
            setViewBoxVal(-100, 0, "inc");
            setViewBoxVal(1, 2, "inc");
        } else if (event.key === "ArrowRight") {
            setViewBoxVal(+100, 0, "inc");
            setViewBoxVal(1, 2, "inc");
        } else if (event.key === "ArrowUp") {
            setViewBoxVal(+50, 2, "inc");
        } else if (event.key === "ArrowDown") {
            setViewBoxVal(-50, 2, "inc");
        }
    }

    const handleWheel = (event) => {
        let scaleIncrement = 0.1;
        event.preventDefault();
        if (event.deltaY < 0) {
            setViewBoxVal(event.deltaY * scaleIncrement, 2, "inc");
        } else {
            setViewBoxVal(event.deltaY * scaleIncrement, 2, "inc");
        }
    }

    const handleHover = (event) => {
        // console.log(event);
        d3.selectAll("rect")
            .on("mouseover", function (d, i) {
                dispatch(selectStackOverView(i))
                setEventContent(i);
                setVisible(true);
            })
            .on("mouseout", function () {
                dispatch(unselectStackOverView())
                setEventContent(null);
                setVisible(false);
            });
    }

    useUpdateLayoutEffect(() => {
        draw();

        window.addEventListener("keydown", handleKey);
        svgRef.current.addEventListener("wheel", handleWheel);
        handleHover();

        const unsubscribe = reactiveStore.subscribe(() => {
            const currentState = reactiveStore.getState();
            handleOutsideModify();
        })

        return () => {
            unsubscribe();
        }
    }, [draw]);

    return (
        <div
            id="icicle"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <svg
                ref={svgRef}
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
            </svg>
            <div
                style={{
                    position: 'fixed',
                    bottom: 5,
                    left: 30
                }}
            >
                <Popover
                    content={<PopoverContent parentPlot='Icicle' eventContent={eventContent}/>}
                    open={visible}
                    arrow={false}
                />
            </div>
        </div>
    )
}

export {Icicle};
