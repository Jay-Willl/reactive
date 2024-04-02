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
    })

    const colorScale = useCreation(() => {
        return d3.scaleOrdinal(d3.schemeTableau10);
    })

    const icicleLayout = useMemo(() => {
        return {
            x: layout.left,
            y: layout.top,
            width: layout.width,
            height: layout.height,
            // width: dimension.width * 0.9,
            // height: dimension.height * 0.9
        }
    }, [layout]);

    const expectedLayout = {

        minRectHeight: layout.height * 0.05,

    }

    useUpdateLayoutEffect(() => {
        console.log(icicleLayout);
        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove();

        svg.append("svg")
            .attr("width", icicleLayout.width)
            .attr("height", icicleLayout.height)
            .attr("transform", `translate(${icicleLayout.x},${icicleLayout.y})`)
            // .attr("viewBox", `0 0 ${icicleLayout.width} ${icicleLayout.height}`);

        svg.selectAll("*").remove();

        data.stackevents.forEach((rect) => {
            svg.append("rect")
                .attr("x", rect.st)
                .attr("y", rect.level * expectedLayout.minRectHeight)
                .attr("width", (rect.et - rect.st) * 100)
                .attr("height", expectedLayout.minRectHeight)
                .style("fill", () => {
                    // console.log(rect);
                    return colorScale(rect.name);
                });
        })
    }, [icicleLayout]);

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
