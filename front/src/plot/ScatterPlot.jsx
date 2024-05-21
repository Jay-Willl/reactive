import * as d3 from 'd3';
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useCreation, useUpdateLayoutEffect, useMouse} from "ahooks";
import {useSelector, useDispatch} from "react-redux";
import {reactiveStore, selectStackMultiView, unselectStackMultiView, selectFollowMultiView, unselectFollowMultiView} from "../store/store.js";

import {Popover} from "antd";
import {PopoverContent} from "../component/PopoverContent.jsx";


function ScatterPlot({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const [visible, setVisible] = useState(false);
    const [eventContent, setEventContent] = useState(null);
    const [followContent, setFollowContent] = useState(null);

    const scatterPlotLayout = useMemo(() => {
        return {
            x: dimension.width / 24,
            y: dimension.height / 24,
            marginX: dimension.width / 24,
            marginY: dimension.height / 24,

            width: dimension.width / 24 * 22,
            height: dimension.height / 24 * 22,

            innerMargin: dimension.height / 12
        }
    }, [dimension]);

    const draw = useCallback(() => {
        let xAxis = d3.scaleLog()
            .domain([d3.min(data, d => d.time_per_call), d3.max(data, d => d.time_per_call)])
            .range([scatterPlotLayout.x, scatterPlotLayout.width])

        let yAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.ceil(d.total_calls))])
            .range([scatterPlotLayout.height -scatterPlotLayout.innerMargin,
                scatterPlotLayout.y + scatterPlotLayout.innerMargin])

        let radius = d3.scaleSqrt(
            [d3.min(data, d => d.total_time), d3.max(data, d => d.total_time)],
            [scatterPlotLayout.width / 1000, scatterPlotLayout.width / 24]
        )

        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", scatterPlotLayout.width);
        svgRef.current.setAttribute("height", scatterPlotLayout.height);
        // svgRef.current.setAttribute("viewBox", `0 0 ${scatterPlotLayout.width} ${scatterPlotLayout.height}`);

        svg.selectAll("*").remove();

        svg.append("g")
            .attr("stroke", "black")
            .selectAll()
            .data(data)
            .join("circle")
            .sort((a, b) => d3.descending(a.total_time, b.total_time))
            .attr("cx", d => {
                // console.log(d.total_time)
                // console.log(xAxis(d.total_time))
                return xAxis(d.time_per_call)
            })
            .attr("cy", d => yAxis(d.total_calls))
            .attr("r", d => radius(d.total_time))
            .attr("fill", "steelblue")



        svg.append("g")
            .attr("transform", `translate(0, ${scatterPlotLayout.height})`)
            .call(
                d3.axisBottom(xAxis)
                    // .ticks(scatterPlotLayout.width / 80, ".1f")
            )

        svg.append("g")
            .attr("transform", `translate(${scatterPlotLayout.x}, 0)`)
            .call(
                d3.axisLeft(yAxis)
                    // .ticks(scatterPlotLayout.width / 80, ".1f")
            )

        svg.append("g")
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .call(g => g.append("g")
                .selectAll("line")
                .data(xAxis.ticks())
                .join("line")
                .attr("x1", d => 0.5 + xAxis(d))
                .attr("x2", d => 0.5 + xAxis(d))
                .attr("y1", scatterPlotLayout.y)
                .attr("y2", scatterPlotLayout.height))
            .call(g => g.append("g")
                .selectAll("line")
                .data(yAxis.ticks())
                .join("line")
                .attr("y1", d => 0.5 + yAxis(d))
                .attr("y2", d => 0.5 + yAxis(d))
                .attr("x1", scatterPlotLayout.x)
                .attr("x2", scatterPlotLayout.width));

    }, [dimension]);

    useLayoutEffect(() => {
        if (divRef.current) {
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
            id="scatterplot"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%',
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

export {ScatterPlot};
