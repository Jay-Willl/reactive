import * as d3 from 'd3';
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useCreation, useUpdateLayoutEffect, useMouse} from "ahooks";
import {useSelector, useDispatch} from "react-redux";
import {
    reactiveStore,
    selectStackMultiView,
    unselectStackMultiView,
    selectFollowMultiView,
    unselectFollowMultiView
} from "../store/store.js";

import {Popover} from "antd";
import {PopoverContent} from "../component/PopoverContent.jsx";

function BarChart({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const [visible, setVisible] = useState(false);
    const [eventContent, setEventContent] = useState(null);
    const [followContent, setFollowContent] = useState(null);

    const mouse = useMouse();
    const windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

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

    const color = useCallback((value) => {
        const index = Math.floor(value / 5);
        const interpolate = d3.scaleSequential([0, 20], d3.interpolateMagma)
        // 返回对应的颜色
        return interpolate(index);
    }, []);

    const draw = useCallback(() => {
        let xAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.percentage)])
            .range([barchartLayout.x, barchartLayout.width])

        let yAxis = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([barchartLayout.y, barchartLayout.height])

        const format = d3.format(".2%");

        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", barchartLayout.width);
        svgRef.current.setAttribute("height", barchartLayout.height);
        svgRef.current.setAttribute("viewBox", `0 0 ${barchartLayout.width} ${barchartLayout.height}`);

        svg.selectAll("*").remove();

        svg.append("g")
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
            .attr("height", expectedLayout.rectHeight - expectedLayout.rectInterval)
            .attr("fill", d => color(d.percentage))


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
            .text((d) => format(d.percentage / 100))
            .call((text) => text.filter(d => xAxis(d.percentage) - xAxis(0) < 50) // short bars
                .attr("dx", +4)
                .attr("fill", "black")
                .attr("text-anchor", "start"));

        svg.append("g")
            .attr("transform", `translate(0,0)`)
            .call(d3.axisTop(xAxis).ticks(barchartLayout.width / 80, "%"))
            .call(g => g.select(".domain").remove());

        svg.selectAll("rect")
            .on("mouseenter", function (d, i) {
                d3.select(this).style("fill", "orange");

                var target = d3.selectAll("rect")
                    .filter(d => {
                        // console.log(d)
                        // console.log(tempStack)
                        // console.log(d.funcname === tempStack.funcname && d.filename === tempStack.filename)
                        return d !== i && d.funcname === i.funcname && d.filename === i.filename;
                    })
                    .node()

                d3.select(target).style("fill", "orange")
                    .filter((d) => {
                        // console.log(d)
                        dispatch(selectFollowMultiView(d), selectStackMultiView(i));
                        setEventContent(i);
                        setFollowContent(d);
                        return true;
                    })

                setVisible(true);
            })
            .on("mouseout", function () {
                draw()
                dispatch(unselectStackMultiView());
                dispatch(unselectFollowMultiView());
                setFollowContent(null);
                setEventContent(null);
                setVisible(false)
            });

    }, [dimension]);

    // useEffect(() => {
    //     // console.log(reactiveEvent);
    //     let tempStack = reactiveEvent.multiview.hover.stack;
    //     // console.log(tempStack)
    //     if (tempStack === null) {
    //         d3.selectAll("rect")
    //             .attr("fill", d => color(d.percentage))
    //     } else {
    //         var target = d3.selectAll("rect")
    //             .filter(d => {
    //                 // console.log(d)
    //                 // console.log(tempStack)
    //                 // console.log(d.funcname === tempStack.funcname && d.filename === tempStack.filename)
    //                 return d !== tempStack && d.funcname === tempStack.funcname && d.filename === tempStack.filename;
    //             })
    //             .node()
    //         console.log(target)
    //             // .filter(d => {
    //             //     console.log(d)
    //             //     return true;
    //             // })
    //         d3.select(target).style("fill", "orange")
    //             .filter((d) => {
    //                 // console.log(d)
    //                 dispatch(selectFollowMultiView(d));
    //                 setFollowContent(d);
    //                 setVisible(true)
    //                 return true;
    //             })
    //     }
    //
    // }, [reactiveEvent.multiview]);

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
            <div
                style={{
                    position: 'fixed',
                    bottom: 5,
                    left: 10
                }}
            >
                <Popover
                    content={<PopoverContent parentPlot='BarChart' eventContent={eventContent}
                                             followContent={followContent}/>}
                    open={visible}
                    arrow={false}
                />
            </div>
        </div>
    )
}

export {BarChart};
