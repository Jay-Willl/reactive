import * as d3 from 'd3';
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useCreation, useUpdateLayoutEffect} from "ahooks";
import {useSelector, useDispatch} from "react-redux";

function BarChart({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const expectedLayout = useMemo(() => {
        return {
            rectHeight: 25,
            rectInterval: 1
        }
    }, [dimension]);

    const barchartLayout = useMemo(() => {
        return {
            x: 0,
            y: 0,
            ogWidth: dimension.width,
            ogHeight: dimension.height,
            width: dimension.width,
            height: Math.ceil((data.length) * (expectedLayout.rectHeight + expectedLayout.rectInterval))
        }
    }, [dimension, expectedLayout]);

    const draw = useCallback(() => {
        let xAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.percentage)])
            .range([barchartLayout.x, barchartLayout.width])

        let yAxis = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([barchartLayout.y, barchartLayout.height])

        const format = xAxis.tickFormat('.1f%');


        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", barchartLayout.width);
        svgRef.current.setAttribute("height", barchartLayout.height);
        svgRef.current.setAttribute("viewBox", `0 0 ${barchartLayout.width} ${barchartLayout.height}`);

        svg.selectAll("*").remove();

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll()
            .data(data)
            .join("rect")
            .attr("x", xAxis(0))
            .attr("y", (d) => {
                return yAxis(d.name)
            })
            .attr("width", (d) => {
                return xAxis(d.percentage) - xAxis(0)
            })
            .attr("height", expectedLayout.rectHeight - expectedLayout.rectInterval);

        svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .selectAll()
            .data(data)
            .join("text")
            .attr("x", (d) => xAxis(d.percentage))
            .attr("y", (d) => yAxis(d.name) + expectedLayout.rectHeight / 2)
            .attr("dy", "0.35em")
            .attr("dx", -4)
            .text((d) => format(d.percentage))
            .call((text) => text.filter(d => xAxis(d.percentage) - xAxis(0) < 20) // short bars
                .attr("dx", +4)
                .attr("fill", "black")
                .attr("text-anchor", "start"));

        svg.append("g")
            .attr("transform", `translate(0,0)`)
            .call(d3.axisTop(xAxis).ticks(barchartLayout.width / 80, "%"))
            .call(g => g.select(".domain").remove());

    }, [dimension]);

    useLayoutEffect(() => {
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }
    }, []);

    useUpdateLayoutEffect(() => {
        draw();
    }, [draw]);

    return (
        <div
            id="barchart"
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

export {BarChart};
