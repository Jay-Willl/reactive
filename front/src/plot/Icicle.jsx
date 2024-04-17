import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useUpdateLayoutEffect, useCreation} from "ahooks";
import {useDispatch, useSelector} from "react-redux";

import {editStart, editEnd, editScale} from "../store/rangeStore.js";
import {selectStack, unselectStack} from "../store/hoverStore.js";
import {Tooltip} from "../component/Tooltip.jsx";

/**
 * Bidirectional translation:
 *      1. event control -> (setViewBoxVal) -> updateHoverEvent -> redraw Timeline component
 *      2. timeline component control -> updateHoverEvent -> (setViewBoxVal)
 */

function Icicle({data, layout}) {
    const rangeEvent = useSelector(state => state.range);
    const hoverEvent = useSelector(state => state.hover);
    const configEvent = useSelector(state => state.config);
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
            let endPercentage = (currentBox[0] + currentBox[2]) / totalBox.width;
            return [startPercentage, endPercentage];
        }
    }, []);

    const range2currentBox = useCreation(() => {
        return (range, totalBox) => {
            let currentStart = range[0] * totalBox.width;
            let currentEnd = range[1] * totalBox.width - currentStart;
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
        svgRef.current.setAttribute("viewBox", `0 0 ${icicleLayout.width} ${icicleLayout.height}`)
        svgRef.current.setAttribute("preserveAspectRatio", "none")
        metadata.current.currentBox = [0, 0, icicleLayout.width, icicleLayout.height];

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
        console.log(getViewBoxVal());
        metadata.current.currentBox = getViewBoxVal();
        dispatchRangeChange();
    }, [svgRef]);

    const dispatchRangeChange = useCallback(() => {
        let rangeArr = currentBox2range(metadata.current.currentBox, metadata.current.totalBox);
        dispatch(editStart(rangeArr[0] * 100));
        dispatch(editEnd(rangeArr[1] * 100));
        console.log(rangeArr);
        console.log(rangeEvent);
        console.log(hoverEvent);
    }, [svgRef]);

    const handleKey = (event) => {
        console.log(event);
        event.preventDefault();
        if (event.key === "ArrowLeft") {
            setViewBoxVal(-100, 0, "inc");
        } else if (event.key === "ArrowRight") {
            setViewBoxVal(+100, 0, "inc");
        } else if (event.key === "ArrowUp") {
            setViewBoxVal(+50, 2, "inc");
        } else if (event.key === "ArrowDown") {
            setViewBoxVal(-50, 2, "inc");
        }
    }

    const handleWheel = (event) => {
        let scaleIncrement = 0.1;
        console.log(event);
        event.preventDefault();
        if (event.deltaY < 0) {
            setViewBoxVal(event.deltaY * scaleIncrement, 2, "inc");
        } else {
            setViewBoxVal(event.deltaY * scaleIncrement, 2, "inc");
        }
    }

    const handleHover = (event) => {
        console.log(event);
        d3.selectAll("rect")
            .on("mouseover", function (d, i) {
                console.log(i);
                console.log(d);
                dispatch(selectStack(i))
            })
            .on("mouseout", function () {
                dispatch(unselectStack())
            });
    }

    useUpdateLayoutEffect(() => {
        draw();

        window.addEventListener("keydown", handleKey);
        svgRef.current.addEventListener("wheel", handleWheel);
        handleHover();

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
        </div>
    )
}

export {Icicle};
