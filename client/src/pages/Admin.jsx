import React, { useState, useEffect } from 'react';
import { getPolls, createPoll, updatePoll, deletePoll, closePoll, reopenPoll } from '../utils/api';

const Admin = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      setLoading(true);
      const response = await getPolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Failed to load polls:', error);
      alert('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(opt => opt.trim());
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    try {
      await createPoll({
        title: formData.title,
        description: formData.description,
        options: validOptions
      });
      setShowCreateModal(false);
      resetForm();
      loadPolls();
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert(error.response?.data?.error || 'Failed to create poll');
    }
  };

  const handleUpdatePoll = async (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(opt => opt.trim());
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    try {
      await updatePoll(editingPoll._id, {
        title: formData.title,
        description: formData.description,
        options: validOptions
      });
      setEditingPoll(null);
      resetForm();
      loadPolls();
    } catch (error) {
      console.error('Failed to update poll:', error);
      alert(error.response?.data?.error || 'Failed to update poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePoll(pollId);
      loadPolls();
    } catch (error) {
      console.error('Failed to delete poll:', error);
      alert(error.response?.data?.error || 'Failed to delete poll');
    }
  };

  const handleClosePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) {
      return;
    }

    try {
      await closePoll(pollId);
      loadPolls();
    } catch (error) {
      console.error('Failed to close poll:', error);
      alert(error.response?.data?.error || 'Failed to close poll');
    }
  };

  const handleReopenPoll = async (pollId) => {
    try {
      await reopenPoll(pollId);
      loadPolls();
    } catch (error) {
      console.error('Failed to reopen poll:', error);
      alert(error.response?.data?.error || 'Failed to reopen poll');
    }
  };

  const openEditModal = (poll) => {
    setEditingPoll(poll);
    setFormData({
      title: poll.title,
      description: poll.description || '',
      options: poll.options.map(opt => opt.text)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      options: ['', '']
    });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const PollForm = ({ onSubmit, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-2">
          Poll Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input w-full"
          required
          placeholder="Enter poll title"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-2">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input w-full min-h-[80px]"
          placeholder="Enter poll description"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-2">
          Options *
        </label>
        <div className="space-y-3">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="input flex-1"
                placeholder={`Option ${index + 1}`}
                required
              />
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-3 flex items-center space-x-2 text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Option</span>
        </button>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setShowCreateModal(false);
            setEditingPoll(null);
            resetForm();
          }}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {submitText}
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-display text-white mb-2">Admin Dashboard</h1>
          <p className="text-neutral-400">Manage all polls</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Poll</span>
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {polls.map((poll, index) => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          return (
            <div
              key={poll._id}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-white mb-1">{poll.title}</h3>
                  {poll.description && (
                    <p className="text-neutral-400 text-sm mb-2">{poll.description}</p>
                  )}
                  <div className="flex items-center space-x-3 text-xs text-neutral-500">
                    <span>{totalVotes} total votes</span>
                    <span>•</span>
                    <span>{poll.options.length} options</span>
                    <span>•</span>
                    <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={poll.isActive ? 'badge-active' : 'badge-closed'}>
                  {poll.isActive ? 'Active' : 'Closed'}
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <button
                  onClick={() => openEditModal(poll)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                {poll.isActive ? (
                  <button
                    onClick={() => handleClosePoll(poll._id)}
                    className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    Close Poll
                  </button>
                ) : (
                  <button
                    onClick={() => handleReopenPoll(poll._id)}
                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    Reopen Poll
                  </button>
                )}
                <button
                  onClick={() => handleDeletePoll(poll._id)}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-down">
            <h2 className="text-2xl font-display text-white mb-6">Create New Poll</h2>
            <PollForm onSubmit={handleCreatePoll} submitText="Create Poll" />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPoll && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-down">
            <h2 className="text-2xl font-display text-white mb-6">Edit Poll</h2>
            <PollForm onSubmit={handleUpdatePoll} submitText="Update Poll" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;