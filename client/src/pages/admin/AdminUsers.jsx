// pages/admin/AdminUsers.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';
import { Spinner, EmptyState, Badge } from '../../components/common';
import API from '../../utils/api';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [toggling,setToggling]= useState(null);
  const [roleChanging, setRoleChanging] = useState(null);
  const currentUser = useSelector((s) => s.auth.user);

  useEffect(() => {
    API.get('/users').then((r) => setUsers(r.data.users)).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await API.put(`/users/${id}/toggle`);
      setUsers((prev) => prev.map((u) => u._id === id ? res.data.user : u));
      toast.success('User status updated.');
    } catch { toast.error('Failed'); }
    setToggling(null);
  };

  const handleRoleChange = async (id, role) => {
    if (currentUser && currentUser._id === id) { toast.error('Cannot change your own role'); return; }
    setRoleChanging(id);
    try {
      const res = await API.put(`/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => u._id === id ? res.data.user : u));
      toast.success('User role updated.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change role'); }
    setRoleChanging(null);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="section-title">Users ({users.length})</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm w-56" />
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['User','Role','Phone','Joined','Status','Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                          {user.avatar?.url ? <img src={user.avatar.url} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.role === 'admin' ? 'info' : 'gray'}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{user.phone || '—'}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 flex gap-2">
                      <button onClick={() => handleToggle(user._id)} disabled={toggling === user._id}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}>
                        {toggling === user._id ? <Spinner size="sm" /> : (user.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />)}
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.role !== 'admin' ? (
                        <button onClick={() => handleRoleChange(user._id, 'admin')} disabled={roleChanging === user._id}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                          {roleChanging === user._id ? <Spinner size="sm" /> : 'Make Admin'}
                        </button>
                      ) : (
                        <button onClick={() => handleRoleChange(user._id, 'user')} disabled={roleChanging === user._id}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100">
                          {roleChanging === user._id ? <Spinner size="sm" /> : 'Demote'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
