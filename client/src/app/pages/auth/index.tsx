import { useState, useEffect } from 'react';
import { authAgent } from '@singletons/network/agents/auth';
import React from 'react';
import { Page } from '@router/Page';

export default Page(({ params, query }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [status, setStatus] = useState('');

  useEffect(() => {

    authAgent.checkAuth().then(res => res.data && setStatus('Already logged in'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Loading...');
    var r ;
    if (mode === 'login') {
      r = await authAgent.login({ email, password });
      setStatus(r.message);
    } else {
      r = await authAgent.register({ email, password, code });
      setStatus(r.message);
    }

  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        {mode === 'register' && (
          <><input placeholder="License Code" value={code} onChange={e => setCode(e.target.value)} /><br /></>
        )}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <p>{status}</p>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
})