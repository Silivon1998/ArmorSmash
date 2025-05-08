import { PageProps } from '@router/Route';
import React from 'react';

export default function TestProtectedPage({ params = {}, query = {} }: PageProps) {

  return (
    <div>
      <h1>PROTECTED ROUTE</h1>
    </div>
  );
}