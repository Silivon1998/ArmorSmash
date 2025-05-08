import React, { useEffect, useState } from 'react';
import { License } from '@shared/types';
import { licenseAgent } from '@singletons/network/agents/license';

export default function LicenseManager() {
  const [licenses, setLicenses] = useState<License.Model[]>([]);
  const [form, setForm] = useState<License.Create.Request>({
    max_users: 1,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshLicenses() {
    setLoading(true);
    const res = await licenseAgent.getAll();
    if (res.success) setLicenses(res.data);
    else setError(res.message);
    setLoading(false);
  }

  async function handleCreate() {
    const res = await licenseAgent.create(form);
    if (!res.success) return alert(res.message);
    await refreshLicenses();
  }

  async function handleDelete(code: string) {
    if (!confirm(`Delete license "${code}"?`)) return;
    const res = await licenseAgent.remove({ code });
    if (!res.success) return alert(res.message);
    await refreshLicenses();
  }

  useEffect(() => {
    refreshLicenses();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>License Manager</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Create License</h2>
        <label>
          Max Users:
          <input
            type="number"
            value={form.max_users}
            onChange={(e) => setForm({ ...form, max_users: Number(e.target.value) })}
          />
        </label>
        <label>
          Expires At:
          <input
            type="datetime-local"
            value={new Date(form.expires).toISOString().slice(0, -8)}
            onChange={(e) =>
              setForm({ ...form, expires: new Date(e.target.value).getTime() })
            }
          />
        </label>
        <button onClick={handleCreate}>Create</button>
      </section>

      <h2>Existing Licenses</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && licenses.length === 0 && <p>No licenses found.</p>}
      {!loading && licenses.length > 0 && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Max Uses</th>
              <th>Used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((lic) => (
              <tr key={lic.code}>
                <td>{lic.code}</td>
                <td>{new Date(lic.created).toLocaleString()}</td>
                <td>{new Date(lic.expires).toLocaleString()}</td>
                <td>{lic.max_uses}</td>
                <td>{lic.uses}</td>
                <td>
                  <button onClick={() => handleDelete(lic.code)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}