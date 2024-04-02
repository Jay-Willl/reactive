import * as d3 from "d3";
import {useCallback, useLayoutEffect, useRef, useState} from "react";
import {useUpdateLayoutEffect} from "ahooks";
import {useDispatch, useSelector} from "react-redux";

import {editScale} from "../store/rangeStore.js";



function Timeline({data}) {
    const rangeEvent = useSelector(state => state.range);
    const dispatch = useDispatch();

    const canvasRef = useRef(null);
    const divRef = useRef(null);
    const axisRef = useRef(null);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    var canvas;
    var ctx;

    const canvasLayout = {
        x: 0,
        y: 0,
        width: dimension.width,
        height: dimension.height
    }

    const timeLayout = {
        x: dimension.width * 0.2,
        y: 15,
        width: dimension.width * 0.8 - 40,
        height: dimension.height - 50,
        offsetX: 8,
        offsetY: 8
    }

    const axisLayout = {
        x: dimension.width * 0.2,
        y: 15,
        width: dimension.width,
        height: 30,
        axisWidth: dimension.width * 0.8 - 40
    }

    const pos2scale = useCallback((position) => {
        let absWidth = timeLayout.width;
        let absLeft = timeLayout.x;
        let dis = position.x - absLeft;
        return dis / absWidth;
    }, [dimension]);

    const draw = useCallback((ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            timeLayout.x + timeLayout.offsetX, timeLayout.y - timeLayout.offsetY,
            timeLayout.width, timeLayout.height
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            timeLayout.x, timeLayout.y,
            timeLayout.width, timeLayout.height
        );
        ctx.strokeRect(
            timeLayout.x, timeLayout.y,
            timeLayout.width, timeLayout.height
        )
    }, [dimension]);

    const redraw = useCallback((ctx, position) => {
        draw(ctx);
        ctx.fillStyle = '#5288F2'
        ctx.fillRect(
            timeLayout.x, timeLayout.y,
            position.x - timeLayout.x - 1,
            timeLayout.height
        )
    }, [dimension]);

    const handleEvent = useCallback((e) => {
        const rect = canvas.getBoundingClientRect();
        const position = {
            x: e.clientX,
            y: e.clientY - rect.top
        }
        redraw(ctx, position);
        let scale = pos2scale(position);
        dispatch(editScale(scale));
        console.log(scale);
    }, [dimension]);

    const addE = useCallback(() => {
        canvas.removeEventListener('click', handleEvent);
        canvas.addEventListener('click', handleEvent);
    }, [dimension])

    useLayoutEffect(() => {
        if (divRef.current) {
            const style = window.getComputedStyle(divRef.current);
            // console.log(divRef.current.clientWidth)
            // console.log(divRef.current.clientHeight)
            // console.log(style.paddingLeft)
            // console.log(style.paddingTop)
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            });
        }
    }, []);

    useUpdateLayoutEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        draw(ctx);
        console.log("effect from timeline!")
        addE();
    }, [addE]);

    useLayoutEffect(() => {
        const svg = d3.select(axisRef.current);

        svg.selectAll("*").remove();

        svg.append("svg")
            .attr("width", axisLayout.width)
            .attr("height", axisLayout.height)
            .attr("transform", `translate(${axisLayout.x},${axisLayout.y})`);

        var xLog = d3.scaleLog()
            .domain([1, 100])
            .range([0, axisLayout.axisWidth]);

        var xLinear = d3.scaleLinear()
            .domain([0, 100])
            .range([0, axisLayout.axisWidth]);

        var xLogAxis = d3.axisBottom(xLog)
            .ticks(10, ",.1s")
            .tickSize(5);

        var xLinearAxis = d3.axisTop(xLinear)
            // .ticks(10, ",.1s")
            .tickSize(5);

        svg.append("g")
            .attr("transform", "translate(" + axisLayout.x + "," + (axisLayout.y) + ")")
            .call(xLogAxis);

        svg.append("g")
            .attr("transform", "translate(" + axisLayout.x + "," + (axisLayout.y) + ")")
            .call(xLinearAxis);
    }, [axisLayout]);


    return (
        <div
            id="timeline"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <svg
                ref={axisRef}
                style={axisLayout}
            >
            </svg>
            <canvas
                ref={canvasRef}
            >
            </canvas>

        </div>
    )
}

export {Timeline};
