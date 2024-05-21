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

    const expectedLayout = useMemo(() => {
        return {
            rectHeight: 25,
            rectInterval: 1
        }
    }, [dimension]);

    const scatterPlotLayout = useMemo(() => {
        return {
            x: 0,
            y: 0,
            width: dimension.width,
            height: dimension.height,
            margin: dimension.width / 24
        }
    }, [dimension, expectedLayout]);

    const draw = useCallback(() => {
        let xAxis = d3.scaleLog()
            .domain([d3.min(data, d => d.total_time), d3.max(data, d => d.total_time)])
            .range([scatterPlotLayout.x + scatterPlotLayout.margin,
                scatterPlotLayout.width - scatterPlotLayout.margin])

        let yAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total_calls)])
            .range([scatterPlotLayout.y + scatterPlotLayout.margin,
                scatterPlotLayout.height - scatterPlotLayout.margin])

        let radius = d3.scaleSqrt([0, d3.max(data, d => d.time_per_call)], [0, scatterPlotLayout.width / 24])

        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", scatterPlotLayout.width);
        svgRef.current.setAttribute("height", scatterPlotLayout.height);
        svgRef.current.setAttribute("viewBox", `0 0 ${scatterPlotLayout.width} ${scatterPlotLayout.height}`);

        svg.selectAll("*").remove();

        console.log(data)

        svg.append("g")
            .attr("stroke", "black")
            .selectAll()
            .data(data)
            .join("circle")
            .sort((a, b) => d3.descending(a.total_time, b.total_time))
            .attr("cx", d => {
                console.log(d.total_time)
                console.log(xAxis(d.total_time))
                return xAxis(d.total_time)
            })
            .attr("cy", d => yAxis(d.total_calls))
            .attr("r", d => radius(d.time_per_call))
            .attr("fill", "steelblue")





        svg.append("g")
            .attr("transform", `translate(0, ${scatterPlotLayout.height})`)
            .call(d3.axisBottom(xAxis).ticks(scatterPlotLayout.width / 80, ","))
            .call(g => g.select(".domain").remove());

        svg.append("g")
            .attr("transform", `translate(${scatterPlotLayout.x}, 0)`)
            .call(d3.axisLeft(yAxis))
            .call(g => g.select(".domain").remove());


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
