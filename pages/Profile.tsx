import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, upsertUserProfile, updateUserPassword, UserProfile } from '../services/supabaseProfile';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Indonesia',
    });

    // Password change state
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        setLoading(true);
        const { data } = await fetchUserProfile(user.id);

        if (data) {
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                postal_code: data.postal_code || '',
                country: data.country || 'Indonesia',
            });
        }
        setLoading(false);
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        setSaving(true);
        const { error } = await upsertUserProfile(user.id, formData);

        if (error) {
            toast.error(error);
        } else {
            toast.success('Profile updated successfully! ✅');
            setEditMode(false);
            loadProfile();
        }
        setSaving(false);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const { error } = await updateUserPassword(newPassword);

        if (error) {
            toast.error(error);
        } else {
            toast.success('Password updated successfully! 🔒');
            setShowPasswordChange(false);
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Profile</h1>
                        <p className="text-slate-400 mt-1">Manage your account information</p>
                    </div>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 bg-brand-600 rounded-full flex items-center justify-center mx-auto">
                                    <User size={48} className="text-white" />
                                </div>
                                {editMode && (
                                    <button className="absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700 transition-colors">
                                        <Camera size={18} className="text-white" />
                                    </button>
                                )}
                            </div>

                            {/* User Info */}
                            <h2 className="text-xl font-bold text-white mb-1">
                                {profile?.full_name || 'Set your name'}
                            </h2>
                            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                                <Mail size={14} />
                                {user.email}
                            </p>

                            {/* Password Change */}
                            <button
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <Lock size={18} />
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            {editMode ? (
                                /* Edit Mode */
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white mb-4">Edit Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                            placeholder="+62 xxx xxx xxx"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 resize-none"
                                            placeholder="Your address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.postal_code}
                                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <Save size={18} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                loadProfile(); // Reset form data
                                            }}
                                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors"
                                        >
                                            <X size={18} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User size={20} className="text-slate-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Full Name</p>
                                                <p className="text-white">{profile?.full_name || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone size={20} className="text-slate-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Phone</p>
                                                <p className="text-white">{profile?.phone || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin size={20} className="text-slate-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Address</p>
                                                <p className="text-white">{profile?.address || 'Not set'}</p>
                                                {profile?.city && profile?.postal_code && (
                                                    <p className="text-slate-400 text-sm">
                                                        {profile.city}, {profile.postal_code}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Password Change Form */}
                        {showPasswordChange && (
                            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handlePasswordChange}
                                            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            Update Password
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPasswordChange(false);
                                                setNewPassword('');
                                                setConfirmPassword('');
                                            }}
                                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
