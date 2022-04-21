# React Custom Hook

Custom Hook is a JavaScript function which we create by ourselves, when we want to share logic between other JavaScript functions.

It allows you to reuse some piece of code in several parts of your app.

- The main reason to write a custom hook is for code reusability.
- For example, instead of writing the same code across multiple components that use the same common stateful logic (say a “setState” or localStorage logic), you can put that code inside a custom hook and reuse it.
- Custom Hooks are functions. Usually, they start with the word “use” (important convention).
- Custom Hooks allow us to access the React ecosystem in terms of hooks, which means we have access to all the known hooks like useState, useMemo, useEffect, etc.
- This mechanism enables the separation of logic and view.

## Where do you put a custom hook?

- Always use Hooks at the top level of your React function.
- By following this rule, you ensure that Hooks are called in the same order each time a component renders.
- That's what allows React to correctly preserve the state of Hooks between multiple useState and useEffect calls.
  
## Why are Hooks better than classes?

- Hooks allow you to use local state and other React features without writing a class.
- Hooks are special functions that let you “hook onto” React state and lifecycle features inside function components.

### Let us look into creation of sample custom hook

- If you find yourself adding a lot of event listeners using useEffect you might consider moving that logic to a custom hook.
- In the recipe below we create a useEventListener hook that handles checking if addEventListener is supported, adding the event listener, and removal on cleanup.

#### `App.js` file:

```js
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
```

#### `useEventListener.js` file:

```js
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
```

## Conclusion

I hope this post aids you in better understanding the custom hooks, and will allow you to creating custom hook. If it has been useful to you, please share and spread the word.

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/react-xz2srv) or check the [github repo link](https://github.com/maheshmuttinti/custom-hooks)
