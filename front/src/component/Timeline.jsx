import * as d3 from "d3";
import {useCallback, useLayoutEffect, useRef, useState, useEffect} from "react";
import {useUpdateLayoutEffect} from "ahooks";
import {useDispatch, useSelector} from "react-redux";

import {reactiveStore} from "../store/store.js";
import {editStart, editEnd, editScale, selectStack, unselectStack} from "../store/store.js";


function Timeline({data}) {
    const reactiveEvent = useSelector(state => state.reactive);
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

    const upperTimeLayout = {
        x: dimension.width * 0.2,
        y: 15,
        width: dimension.width * 0.8 - 40,
        height: (dimension.height - 50) / 2,
        offsetX: 8,
        offsetY: 8
    }

    const bottomTimeLayout = {
        x: dimension.width * 0.2,
        y: 15 + upperTimeLayout.height,
        width: dimension.width * 0.8 - 40,
        height: (dimension.height - 50) / 2
    }

    const axisLayout = {
        x: dimension.width * 0.2,
        y: 15,
        width: dimension.width,
        height: 30,
        axisWidth: dimension.width * 0.8 - 40
    }

    const pos2scale = useCallback((position) => {
        let absWidth = upperTimeLayout.width;
        let absLeft = upperTimeLayout.x;
        let dis = position.x - absLeft;
        return dis / absWidth;
    }, [dimension]);

    const x2scale = useCallback((x) => {
        let absWidth = upperTimeLayout.width;
        let absLeft = upperTimeLayout.x;
        let dis = x - absLeft;
        return dis / absWidth;
    }, [dimension]);

    const scale2x = useCallback((scale) => {
        let absWidth = upperTimeLayout.width;
        let absLeft = upperTimeLayout.x;
        return scale * absWidth + absLeft;
    }, [dimension]);

    const decidePosition = useCallback((position) => {
        if (position.x < upperTimeLayout.x || position.x > upperTimeLayout.x + upperTimeLayout.width ||
            position.y < upperTimeLayout.y || position.y > bottomTimeLayout.y + upperTimeLayout.height) {
            return -1;
        } else if (position.y < upperTimeLayout.y + upperTimeLayout.height) {
            return 0;
        } else if (position.y < bottomTimeLayout.y + bottomTimeLayout.height) {
            if (Math.abs(x2scale(position.x) * 100 - reactiveEvent.range.start) < Math.abs(x2scale(position.x * 100) - reactiveEvent.range.end)) {
                return 1;
            } else {
                return 2;
            }
        }
    }, [dimension, reactiveEvent]);

    const draw = useCallback((ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            upperTimeLayout.x + upperTimeLayout.offsetX, upperTimeLayout.y - upperTimeLayout.offsetY,
            upperTimeLayout.width, upperTimeLayout.height
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            upperTimeLayout.x, upperTimeLayout.y,
            upperTimeLayout.width, upperTimeLayout.height
        );
        ctx.fillRect(
            bottomTimeLayout.x, bottomTimeLayout.y,
            bottomTimeLayout.width, bottomTimeLayout.height
        )
        ctx.strokeRect(
            upperTimeLayout.x, upperTimeLayout.y,
            upperTimeLayout.width, upperTimeLayout.height + bottomTimeLayout.height
        )
    }, [dimension]);

    const redraw = useCallback((ctx) => {
        const currentState = reactiveStore.getState();
        // console.log(currentState.reactive.range)

        draw(ctx);
        // redraw scale rect
        ctx.fillStyle = '#D9E8F5';
        ctx.fillRect(
            upperTimeLayout.x,
            upperTimeLayout.y,
            scale2x(currentState.reactive.range.scale) - upperTimeLayout.x,
            upperTimeLayout.height
        )
        // console.log('scale ' + upperTimeLayout.x + ' ' + scale2x(currentState.reactive.range.scale));

        // redraw position rect
        ctx.fillStyle = '#91BED4';
        ctx.fillRect(
            scale2x(currentState.reactive.range.start / 100),
            bottomTimeLayout.y,
            scale2x(currentState.reactive.range.end / 100) - scale2x(currentState.reactive.range.start / 100),
            bottomTimeLayout.height
        )
        // console.log('position ' + scale2x(currentState.reactive.range.start / 100) + ' ' + scale2x(currentState.reactive.range.end / 100));
    }, [dimension]);

    const handleEvent = useCallback((e) => {
        const currentEvent = reactiveStore.getState();
        const rect = canvas.getBoundingClientRect();
        const position = {
            x: e.clientX,
            y: e.clientY - rect.top
        }

        // console.log(position);
        // console.log(decidePosition(position));

        if (decidePosition(position) === -1) {
            return;
        } else if (decidePosition(position) === 0) {
            let scale = pos2scale(position);
            dispatch(editScale(scale));
        } else if (decidePosition(position)) {
            if (e.button === 0) {
                let scale = pos2scale(position) * 100;
                if (currentEvent.reactive.range.end < scale) {
                    return;
                } else {
                    dispatch(editStart(scale));
                }
            } else if (e.button === 2) {
                let scale = pos2scale(position) * 100;
                dispatch(editEnd(scale));
            }
        }
        redraw(ctx);
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
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            });
        }
    }, []);

    useUpdateLayoutEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        redraw(ctx);
        addE();

        const unsubscribe = reactiveStore.subscribe(() => {
            const currentState = reactiveStore.getState();
            redraw(ctx);
        })

        return () => {
            unsubscribe();
        }
    }, [addE, redraw]);

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

        var xLogAxis = d3.axisTop(xLog)
            .ticks(10, ",.1s")
            .tickSize(5);

        var xLinearAxis = d3.axisBottom(xLinear)
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
