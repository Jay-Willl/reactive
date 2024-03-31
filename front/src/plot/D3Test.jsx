import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";


function D3Test({data}) {
    const svgRef = useRef(null);

    const root = useMemo(() => {
        return d3.hierarchy(data)
    }, [data]);

    const partition = useMemo(() => {
        return d3.partition()
            .size([400, 300])
            .padding(1);
    }, []);


    console.log(root);
    console.log(partition);

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 40, left: 90 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([0, width]);

        const y = d3.scaleBand()
            .range([0, height])
            .domain(data.map((d, i) => i))
            .padding(0.1);

        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d))
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2");
    }, [data]);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 400 300"
        >

        </svg>
    )
}

export {D3Test};
