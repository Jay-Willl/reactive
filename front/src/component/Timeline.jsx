import {useState, useLayoutEffect, useRef, useCallback} from "react";
import {useUpdateLayoutEffect} from "ahooks";
import {useSelector, useDispatch} from "react-redux";

import {editStart, editEnd} from "../store/rangeStore.js";


function Timeline({data}) {
    const rangeEvent = useSelector(state => state.range);
    const dispatch = useDispatch();

    const canvasRef = useRef(null);
    const divRef = useRef(null);
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
        x: dimension.width * 0.19,
        y: 35,
        width: dimension.width * 0.8 - 20,
        height: dimension.height - 45,
        offsetX: 5,
        offsetY: 5
    }

    const draw = useCallback((ctx) => {
        // console.log(dimention);
        console.log(2)

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
            timeLayout.x - timeLayout.offsetX, timeLayout.y + timeLayout.offsetY,
            timeLayout.width, timeLayout.height
        );
        ctx.strokeRect(
            timeLayout.x - timeLayout.offsetX, timeLayout.y + timeLayout.offsetY,
            timeLayout.width, timeLayout.height
        )
    }, [canvas, dimension, timeLayout]);

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

    useLayoutEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        draw(ctx);
    }, [draw]);


    return (
        <div
            id="timeline"
            ref={divRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <canvas
                ref={canvasRef}
            >
            </canvas>
        </div>
    )
}

export {Timeline};
