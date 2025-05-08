import { Page } from '@router/Page';
import React from 'react';

export default Page(({ params, query  }) => {
  const { a,b,C } = params as any;

  return (
    <div>
      <h2>Param 1: {a}</h2>
      <h2>Param 2: {b}</h2>
      <h2>Param 3: {C}</h2>
    </div>
  );
})