import {useLayoutEffect, useRef, useState} from "react";
import {useUpdateLayoutEffect} from "ahooks";


function Example() {
    const divRef = useRef(null);
    const [dimension, setDimension]
        = useState({width: 0, height: 0});

    useUpdateLayoutEffect(() => {
        // draw something here
    }, [dimension]);  // specify 'dimension' to dependency array

    // update layout information using 'useLayoutEffect'
    useLayoutEffect(() => {
        if (divRef.current) {
            setDimension({
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight
            })
        }
    }, []);

    return (
        <div
            ref={divRef}  // set reference div
            style={{  // make sure this component fit the size of its parent
                width: '100%',
                height: '100%'
            }}
        >
            <>COMPONENT CONTENT</>
        </div>
    )
}
