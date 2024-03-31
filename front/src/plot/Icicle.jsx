import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";

const expectedLayout = {

}


function Icicle({data}) {
    const svgRef = useRef(null);

    useEffect(() => {
        const margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = 1000 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.selectAll("*").remove();

        const rectHeight = 20;

        data.forEach((rect) => {
            svg.append("rect")
                .attr("x", rect.st)
                .attr("y", rect.level * rectHeight)
                .attr("width", (rect.et - rect.st) * 100)
                .attr("height", rectHeight)
                .style("fill", "steelblue");
        })
    }, [data]);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 1000 300"
        >

        </svg>
    )
}

export {Icicle};
