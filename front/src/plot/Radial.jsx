import * as d3 from 'd3';
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useCreation, useUpdateLayoutEffect, useMouse} from "ahooks";
import {useSelector, useDispatch} from "react-redux";
import {reactiveStore, selectStackMultiView, unselectStackMultiView, selectFollowMultiView, unselectFollowMultiView} from "../store/store.js";

import {Popover} from "antd";
import {PopoverContent} from "../component/PopoverContent.jsx";


function Radial({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const svgRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    const [visible, setVisible] = useState(false);
    const [eventContent, setEventContent] = useState(null);
    const [followContent, setFollowContent] = useState(null);

    const expectedLayout = useMemo(() => {

    }, [dimension]);

    const radialLayout = useMemo(() => {
        return {
            cx: dimension.width * 0.45,
            cy: dimension.height * 0.5,
            width: dimension.width,
            height: dimension.height,
            radius: Math.min(dimension.width, dimension.height) / 2,
        }
    }, [dimension, expectedLayout]);

    const root = useMemo(() => {
        const tree = d3.tree()
            .size([2 * Math.PI, radialLayout.radius])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
        return tree(
            d3.hierarchy(data)
                .sort((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)
        )
    }, [data, radialLayout]);

    const draw = useCallback(() => {
        const svg = d3.select(svgRef.current);
        svgRef.current.setAttribute("width", dimension.width);
        svgRef.current.setAttribute("height", dimension.height);
        svgRef.current.setAttribute("viewBox", `${-radialLayout.cx}, ${-radialLayout.cy}, ${radialLayout.width}, ${radialLayout.height}`);

        svg.selectAll("*").remove()

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(root.links())
            .join("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        svg.append("g")
            .selectAll()
            .data(root.descendants())
            .join("circle")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);

        // svg.append("g")
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-width", 3)
        //     .selectAll()
        //     .data(root.descendants())
        //     .join("text")
        //     .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
        //     .attr("dy", "0.31em")
        //     .attr("x", d => (d.x < Math.PI) === !d.children ? 6 : -6)
        //     .attr("text-anchor", d => (d.x < Math.PI) === !d.children ? "start" : "end")
        //     .attr("paint-order", "stroke")
        //     .attr("stroke", "white")
        //     .attr("fill", "currentColor")
        //     .text(d => {
        //         return d.data.name.split(/\s/, 1)
        //     });

        // svg.selectAll("circle")
        //     .on("mouseover", function (d, i) {
        //         d3.select(this).style("fill", "red");
        //         // console.log(d)
        //         // console.log(i)
        //         dispatch(select(i.data))
        //     })
        //     .on("mouseout", function() {
        //         d3.select(this).style("fill", d => d.children ? "#555" : "#999");
        //         dispatch(unselect())
        //     });

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
            id="radial"
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

export {Radial};
