import React from 'react';

function BrokenComponent() {
  useEffect(() => {
    // Should error: no useEffect import
    console.log(undefinedVar); // Should error: undefined var
  }, []);
  return <div>{unusedVar}</div>; // Should warn: unused var
}
a = 5;
