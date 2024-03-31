import * as d3 from "d3";
import {useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback} from "react";


function ViewBox() {
    const divRef = useRef(null);

    let isDragging = false;
    let startX;
    let startY;
    let startViewBoxX;
    let startViewBoxY;

    const handleSvgOnMouseDown = (e) => {
        isDragging = true;
        const rect = divRef.current.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        const viewBox = divRef.current.viewBox.baseVal;
        startViewBoxX = viewBox.x;
        startViewBoxY = viewBox.y;
    }

    window.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const rect = divRef.current.getBoundingClientRect();
            const dx = e.clientX - rect.left - startX;
            const dy = e.clientY - rect.top - startY;
            divRef.current.setAttribute('viewBox', `${startViewBoxX - dx} ${startViewBoxY - dy} 400 300`);
        }
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
    });

    return (
        <svg
            id="mySVG"
            viewBox="0 0 400 300"
            ref={divRef}
            onMouseDown={handleSvgOnMouseDown}
        >
            <circle cx="100" cy="150" r="80" fill="red"/>
            <rect x="200" y="50" width="150" height="100" fill="green"/>
            <text x="50" y="50" fill="blue">Drag to move around</text>
        </svg>
    )
}

export {ViewBox};
