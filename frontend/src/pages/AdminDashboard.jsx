import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.users || []);
    } catch (err) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await api.patch(`/admin/users/${user.id}/unblock`);
        showToast(`User ${user.name} unblocked`, 'success');
      } else {
        await api.patch(`/admin/users/${user.id}/block`);
        showToast(`User ${user.name} blocked`, 'success');
      }
      fetchUsers();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const fetchAllTasks = async () => {
    setTasksLoading(true);
    try {
      const res = await api.get('/admin/tasks'); 
      setTasks(res.data.data.tasks || []);
    } catch (err) {
      showToast('Failed to fetch tasks', 'error');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('WARNING: As Admin, are you sure you want to globally delete this task?')) return;
    try {
      await api.delete(`/admin/tasks/${id}`);
      showToast('Task deleted successfully', 'success');
      fetchAllTasks();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'tasks') fetchAllTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '12px 24px', 
            fontWeight: 500,
            borderBottom: activeTab === 'users' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'users' ? 'var(--primary-color)' : 'var(--text-secondary)'
          }}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          style={{ 
            padding: '12px 24px', 
            fontWeight: 500,
            borderBottom: activeTab === 'tasks' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'tasks' ? 'var(--primary-color)' : 'var(--text-secondary)'
          }}
        >
          Manage All Tasks
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-high' : 'badge-low'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isBlocked ? 'badge-high' : 'badge-completed'}`}>
                        {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleBlock(u)} 
                          style={{ color: u.isBlocked ? 'var(--success-color)' : 'var(--error-color)' }}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Owner ID (Ref)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasksLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>Loading tasks...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No tasks found in system.</td></tr>
              ) : (
                tasks.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                    <td><span className={`badge badge-${t.priority}`}>{t.priority.toUpperCase()}</span></td>
                    <td><span className={`badge badge-${t.status.replace('-', '')}`}>{t.status.toUpperCase().replace('-', ' ')}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{t.userId}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteTask(t.id)} style={{ color: 'var(--error-color)' }}>Global Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
