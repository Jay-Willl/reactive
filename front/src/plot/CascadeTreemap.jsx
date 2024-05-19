import * as d3 from 'd3';
import {useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect} from "react";
import {useCreation, useUpdateLayoutEffect} from "ahooks";
import {useSelector, useDispatch} from "react-redux";
import {selectStackMultiView, unselectFollowMultiView, unselectStackMultiView, selectFollowMultiView} from "../store/store.js";

import {Popover} from "antd";
import {PopoverContent} from "../component/PopoverContent.jsx";

function CascadeTreemap({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const [visible, setVisible] = useState(false);
    const [eventContent, setEventContent] = useState(null);
    const [followContent, setFollowContent] = useState(null);

    const treemapLayout = useMemo(() => {
        return {
            x: 0,
            y: 0,
            ogWidth: dimension.width,
            ogHeight: dimension.height,
            width: dimension.width,
            height: dimension.height,
        }
    }, [dimension]);

    const color = useCreation(() => {
        // return d3.scaleOrdinal(d3.schemeCategory10);
        return d3.scaleSequential([20, 0], d3.interpolateMagma);
    });

    const logTransform = (d) => {
        return Math.log1p(d);
    }

    const hierarchy = useCreation(() => {
        return d3.hierarchy(data)
            .sum(d => {
                return logTransform(d.dur)
            })
            .sort((a, b) => a.value - b.value)
    }, [data]);

    const treemap = useCallback(() => {
        return d3.treemap()
            .size([treemapLayout.width, treemapLayout.height])
            .paddingOuter(3)
            .paddingTop(18)
            .paddingInner(3)
            .round(true)(hierarchy);
    }, [hierarchy, treemapLayout])

    const draw = useCallback(() => {
        let root = treemap(data);
        // const root = treemap(data).leaves().filter(d => (d.x1 - d.x0) >= 1 && (d.y1 - d.y0) >= 3);
        const format = d3.format(",d");
        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", treemapLayout.width);
        svgRef.current.setAttribute("height", treemapLayout.height);
        svgRef.current.setAttribute("viewBox", `0 0 ${treemapLayout.width} ${treemapLayout.height}`);

        svg.append("filter")
            .append("feDropShadow")
            .attr("flood-opacity", 0.3)
            .attr("dx", 0)
            .attr("stdDeviation", 3);

        const node = svg.selectAll("g")
            .data(d3.group(root, d => d.height))
            .join("g")
            .selectAll("g")
            .data(d => {
                return d[1];
            })
            .join("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        node.append("title")
            .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

        node.append("rect")
            .attr("id", d => (d.data.hash))
            .attr("fill", d => color(d.height))
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)

        svg.selectAll("rect")
            .on("mouseenter", function (d, i) {
                d3.select(this).style("fill", "red");
                dispatch(selectStackMultiView(i.data));
                setVisible(true);
                setEventContent(i.data);
                // console.log(i.data)
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", d => color(d.height));
                dispatch(unselectStackMultiView());
                setVisible(false);
            });

    }, [treemapLayout, treemap]);

    useEffect(() => {
        let tempStack = reactiveEvent.multiview.hover.stack;
        if (tempStack === null) {
            d3.selectAll("rect")
                .style("fill", d => color(d.height));
            dispatch(unselectFollowMultiView());
            setFollowContent(null);
        } else {
            d3.selectAll("rect")
                .filter((d, i) => {
                    // console.log(tempStack)
                    // console.log(d)
                    return (d.data.name === tempStack.name
                        && d.data.hash === tempStack.hash);
                })
                .filter((d, i) => {
                    console.log(d)
                    console.log(tempStack)
                    return true
                })
                .style("fill", "red")
                .filter((d, i) => {
                    // console.log(d)
                    dispatch(selectFollowMultiView(d.data))
                    setFollowContent(d.data);
                    return true;
                })
        }
    }, [reactiveEvent.multiview]);

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
            id="cascadetreemap"
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
            <div>
                <Popover
                    content={<PopoverContent parentPlot='CascadeTreemap' eventContent={eventContent} followContent={followContent}/>}
                    open={visible}
                    arrow={false}
                >
                </Popover>
            </div>
        </div>
    )
}

export {CascadeTreemap};
