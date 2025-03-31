import React from 'react';
function TestComponent() {
  const message = 'Hello World';
  useEffect(() => {
    // <- ESLint error: 'useEffect' not defined
    console.log(message); // <- ESLint warning: 'message' missing in deps
  }, []);
  return <div>{message}</div>;
}
a = 5;
