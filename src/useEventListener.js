import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, handler, element = window) {
  // create a ref that store handler
  const savedHandler = useRef(null);

  // update ref.current value if handler changes
  // this allows our effect below to always get latest handler
  // without us needing to pass it in effect dependencies array
  // and potentially cause effect to re-run every render
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // make sure element support addEventListener
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    // create event listener that calls handler function stored in ref
    const eventListener = (event) => savedHandler?.current(event);

    // add event listener to element
    element.addEventListener(eventName, eventListener);

    // remove event listener on cleanup
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
