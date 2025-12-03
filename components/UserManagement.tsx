import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Trash2, UserPlus, Shield, Edit2, Check, X, ShieldAlert } from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  allUsers: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  currentUser, 
  allUsers, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    password: '',
    role: UserRole.TEACHER
  });

  const resetForm = () => {
    setFormData({ username: '', password: '', role: UserRole.TEACHER });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ ...user });
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formData.username || !formData.password || !formData.role) return;

    if (editingId) {
      onUpdateUser({ ...formData, id: editingId } as User);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username!,
        password: formData.password!,
        role: formData.role!
      };
      onAddUser(newUser);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <ShieldAlert className="w-6 h-6 mr-2 text-brand-600" />
            User Management
          </h2>
          <p className="text-slate-500">Create, edit, and remove system access.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Editor Form */}
      {(isAdding || editingId) && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {isAdding ? 'Create New User' : 'Edit User'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
              <input 
                type="text" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.TEACHER}>Teacher</option>
                <option value={UserRole.SUPERUSER}>Superuser</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button 
              onClick={resetForm}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.username || !formData.password}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Save User
            </button>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Username</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Password</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.username}
                  {user.id === currentUser.id && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">You</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${user.role === UserRole.SUPERUSER ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                      user.role === UserRole.ADMIN ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {user.role === UserRole.SUPERUSER && <Shield className="w-3 h-3 mr-1" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-400">
                  {/* In a real app, never show passwords. For this specific request, we show them or hide them. */}
                  ••••••
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    {/* Prevent deleting self or the root superuser if hardcoded logic existed, but for now simple check */}
                    {user.username !== 'Frazadmin' && user.id !== currentUser.id && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;