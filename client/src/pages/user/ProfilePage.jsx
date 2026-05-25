// pages/user/ProfilePage.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiSave } from 'react-icons/fi';
import { updateUser } from '../../redux/slices/authSlice';
import { Spinner } from '../../components/common';
import API from '../../utils/api';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const [loading,   setLoading]   = useState(false);
  const [pwdLoad,   setPwdLoad]   = useState(false);
  const [tab,       setTab]       = useState('profile');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = React.useRef(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/users/profile', profile);
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPwd !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwords.newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPwdLoad(true);
    try {
      await API.put('/auth/password', { currentPassword: passwords.current, newPassword: passwords.newPwd });
      toast.success('Password changed!');
      setPasswords({ current: '', newPwd: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setPwdLoad(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <h1 className="section-title mb-8">My Profile</h1>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-5">
          <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {user?.avatar?.url
              ? <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              : <FiUser size={32} className="text-gray-400" />
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              setAvatarUploading(true);
              const form = new FormData();
              form.append('avatar', file);
              const res = await API.post('/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
              // API returns { success: true, avatar }
              dispatch(updateUser({ avatar: res.data.avatar }));
              toast.success('Profile picture updated!');
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed to upload avatar');
            } finally {
              setAvatarUploading(false);
            }
          }} />
          <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md">
            {avatarUploading ? <Spinner size="xs" color="white" /> : <FiCamera size={12} className="text-gray-900" />}
          </button>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-6">
        {['profile', 'password'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t === 'profile' ? 'Personal Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleProfileSave}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" value={user?.email} disabled className="input-field pl-11 opacity-60 cursor-not-allowed" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+92 300 1234567" className="input-field pl-11" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Spinner size="sm" color="gray" /> : <FiSave size={16} />}
            Save Changes
          </button>
        </motion.form>
      )}

      {tab === 'password' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePasswordChange}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          {[
            { key: 'current', label: 'Current Password',  placeholder: '••••••••' },
            { key: 'newPwd',  label: 'New Password',      placeholder: 'Min 6 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder={f.placeholder} value={passwords[f.key]}
                  onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                  className="input-field pl-11" required />
              </div>
            </div>
          ))}
          <button type="submit" disabled={pwdLoad} className="btn-primary flex items-center gap-2">
            {pwdLoad ? <Spinner size="sm" color="gray" /> : <FiLock size={16} />}
            Change Password
          </button>
        </motion.form>
      )}
    </div>
  );
}
