import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style.css';
import useEventListener from './useEventListener';

export default function App() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [targetElement, setTargetElement] = useState(null);

  const buttonRef = useRef(null);
  const headingRef = useRef(null);

  // event utilizing useCallback, so that reference never changes
  const handler1 = useCallback((event) => {
    const { clientX, clientY } = event;
    // update coordinates
    setCoords({ x: clientX, y: clientY });
  });

  const handler2 = useCallback((event) => {
    const { currentTarget } = event;
    // update buttonCoords
    setTargetElement(currentTarget.tagName);
  });

  useEventListener('mousemove', handler1);
  useEventListener('click', handler2, buttonRef?.current);
  useEventListener('click', handler2, headingRef?.current);

  return (
    <div>
      <h1>
        The mouse coordinates ({coords.x}, {coords.y})
      </h1>
      <button ref={buttonRef}>Button</button>

      <h1 style={{ cursor: 'pointer' }} ref={headingRef}>
        Heading
      </h1>
      <h2>You clicked the {targetElement}</h2>
    </div>
  );
}
