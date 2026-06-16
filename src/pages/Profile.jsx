import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User, Mail, Calendar, Camera, Loader2, CheckCircle, Shield, Trash2,
  Edit3, Save, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function Profile() {
  const { user, login: refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = { ...user, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to upload profile picture');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Remove profile picture?')) return;
    setUploadingAvatar(true);
    try {
      await api.delete('/auth/avatar');
      const updatedUser = { ...user, avatar: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatarPreview(null);
      window.location.reload();
      toast.success('Profile picture removed');
    } catch {
      toast.error('Failed to remove profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmitProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name: data.name });
      const updatedUser = { ...user, name: res.data.user.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditMode(false);
      toast.success('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const currentAvatar = avatarPreview || user?.avatar;

  return (
    <div className="page-container py-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Profile</h1>
        <p className="text-text-secondary">Manage your account details and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-border">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-primary/60" />
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-2xl">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary hover:bg-primary-600 text-white flex items-center justify-center shadow-glow-sm transition-all active:scale-90"
              title="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-text-primary">{user?.name}</h2>
            <p className="text-text-secondary mt-0.5">{user?.email}</p>
            <p className="text-text-muted text-sm mt-1">
              Member since {formatDate(user?.createdAt)}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
                <CheckCircle className="w-3 h-3" />
                Active Account
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Shield className="w-3 h-3" />
                Verified
              </span>
            </div>

            {currentAvatar && (
              <button
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                className="mt-3 text-xs text-text-muted hover:text-error flex items-center gap-1 mx-auto sm:mx-0 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Remove picture
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-text-muted text-center sm:text-left">
          Supports JPG, PNG, WEBP · Max 5 MB
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Account Information</h3>
          {!editMode ? (
            <button
              onClick={() => { setEditMode(true); reset({ name: user?.name }); }}
              className="btn-secondary flex items-center gap-2 text-sm py-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="btn-ghost flex items-center gap-2 text-sm py-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Your full name"
                />
              </div>
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field pl-10 cursor-not-allowed"
                />
              </div>
              <p className="text-text-muted text-xs mt-1">Email address cannot be changed</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary flex items-center gap-2"
              >
                {savingProfile
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  : <><Save className="w-4 h-4" />Save Changes</>
                }
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', value: user?.name },
              { icon: Mail, label: 'Email Address', value: user?.email },
              { icon: Calendar, label: 'Member Since', value: formatDate(user?.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">{label}</p>
                  <p className="text-text-primary font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card border-error/20"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-2">Danger Zone</h3>
        <p className="text-text-secondary text-sm mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-error border border-error/30 rounded-xl hover:bg-error/5 transition-all"
          onClick={() => toast.error('Contact support to delete your account')}
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
