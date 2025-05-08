import { Page } from '@router/Page';
import React from 'react';

export default Page(({ params, query }) => {
  const { p, p2, p3 } = params as any;

  return (
    <div>
      <h2>Param 1: {p}</h2>
      <h2>Param 2: {p2}</h2>
      <h2>Param 3: {p3}</h2>
      <pre>{JSON.stringify(query) || ""}</pre>
    </div>
  );
})
