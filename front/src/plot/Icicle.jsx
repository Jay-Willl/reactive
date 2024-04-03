import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";
import {useUpdateLayoutEffect, useCreation} from "ahooks";
import {useDispatch, useSelector} from "react-redux";


function Icicle({data, layout}) {
    const rangeEvent = useSelector(state => state.range);
    const hoverEvent = useSelector(state => state.hover);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);

    const setViewBox = useCallback((val, index) => {
        var viewBox = svgRef.getAttribute("viewBox");
        var parts = viewBox.split(' ');
        parts[index] = val;
        svgRef.setAttribute("viewBox", parts.join(' '));
    }, []);

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

    const expectedLayout = {
        initRectHeight: layout.height * 0.05,
        minRectHeight: 10,
        maxRectHeight: layout.height * 0.3,
        rectInterval: 1
    }

    const handleRectX = useCallback((st) => {
        return st;
    }, [expectedLayout]);

    const handleRectWidth = useCallback((st, et) => {
        return (et - st) * 100;
    }, [expectedLayout]);

    const handleRectY = useCallback((level) => {
        return level * (expectedLayout.initRectHeight + expectedLayout.rectInterval);
    }, [expectedLayout]);

    const handleRectHeight = useCallback(() => {
        return expectedLayout.initRectHeight
    }, [expectedLayout]);

    const zoom = useCallback(() => {
        const svg = d3.select(svgRef.current);
        svg.attr(
            "viewBox",
            `0 0 ${icicleLayout.width / translateScale(rangeEvent.scale)} ${icicleLayout.height / translateScale(rangeEvent.scale)}`
        )

        data.stackevents.forEach((rect) => {
            svg.append("rect")
                .attr("x", handleRectX(rect.st))
                .attr("y", handleRectY(rect.level) / translateScale(rangeEvent.scale))
                .attr("width", handleRectWidth(rect.st, rect.et))
                .attr("height", handleRectHeight() / translateScale(rangeEvent.scale))
                .style("fill", () => {
                    // console.log(rect);
                    return colorScale(rect.name);
                });
        })
    }, [rangeEvent, icicleLayout, translateScale]);

    const draw = useCallback(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg.append("svg")
            .attr("width", icicleLayout.width)
            .attr("height", icicleLayout.height)
            .attr("transform", `translate(${icicleLayout.x},${icicleLayout.y})`)

        zoom();
    }, [handleRectX, handleRectWidth, handleRectY, handleRectHeight, icicleLayout, zoom]);

    useUpdateLayoutEffect(() => {
        draw();
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
