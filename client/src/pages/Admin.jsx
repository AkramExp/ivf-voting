import React, { useState, useEffect } from 'react';
import { getPolls, createPoll, updatePoll, deletePoll, closePoll, reopenPoll } from '../utils/api';
import { PollForm } from '../components/PollForm';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'closed'

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
      // Show error toast instead of alert
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(opt => opt.trim());

    if (validOptions.length < 2) {
      // Show error toast
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
      // Show success toast
    } catch (error) {
      console.error('Failed to create poll:', error);
      // Show error toast
    }
  };

  const handleUpdatePoll = async (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(opt => opt.trim());

    if (validOptions.length < 2) {
      // Show error toast
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
      // Show success toast
    } catch (error) {
      console.error('Failed to update poll:', error);
      // Show error toast
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePoll(pollId);
      loadPolls();
      // Show success toast
    } catch (error) {
      console.error('Failed to delete poll:', error);
      // Show error toast
    }
  };

  const handleClosePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) {
      return;
    }

    try {
      await closePoll(pollId);
      loadPolls();
      // Show success toast
    } catch (error) {
      console.error('Failed to close poll:', error);
      // Show error toast
    }
  };

  const handleReopenPoll = async (pollId) => {
    try {
      await reopenPoll(pollId);
      loadPolls();
      // Show success toast
    } catch (error) {
      console.error('Failed to reopen poll:', error);
      // Show error toast
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

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'active') {
      return matchesSearch && poll.isActive;
    } else if (filter === 'closed') {
      return matchesSearch && !poll.isActive;
    }

    return matchesSearch;
  });


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
          <div className="absolute top -0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm font-light tracking-wide">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-8 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-400 text-base">
                Manage community polls and voting activities
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Poll</span>
            </button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Polls</p>
                  <p className="text-2xl font-bold text-white">{polls.length}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Polls</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Closed Polls</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.filter(p => !p.isActive).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="text-2xl font-bold text-white">
                    {polls.reduce((sum, poll) => sum + poll.options.reduce((s, opt) => s + opt.votes, 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-gray-700/50">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div> */}

          {/* Controls */}
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search polls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'all'
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'active'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('closed')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'closed'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    Closed
                  </button>
                </div>

                <button
                  onClick={loadPolls}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-white hover:border-gray-600 transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Polls List */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredPolls.length}</span> of{' '}
            <span className="text-white font-semibold">{polls.length}</span> polls
          </div>
          <div className="text-sm text-gray-500">
            {filteredPolls.length} {filteredPolls.length === 1 ? 'poll' : 'polls'} found
          </div>
        </div>

        {filteredPolls.length === 0 ? (
          <div className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Polls Found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || filter !== 'all'
                ? 'No polls match your current search or filter criteria.'
                : 'No polls have been created yet. Create your first poll to get started!'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
            >
              Create First Poll
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll, index) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 1);

              return (
                <div
                  key={poll._id}
                  className="backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-800/50 p-6 animate-slide-up hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${poll.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                          {poll.isActive ? 'Active' : 'Closed'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{poll.title}</h3>
                      {poll.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{poll.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Poll Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-400">Options</span>
                        </div>
                        <span className="text-white font-semibold">{poll.options.length}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-400">Votes</span>
                        </div>
                        <span className="text-white font-semibold">{totalVotes}</span>
                      </div>
                    </div>

                    {/* Vote distribution preview */}
                    <div className="space-y-2">
                      {poll.options.slice(0, 3).map((option, idx) => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500'];

                        return (
                          <div key={option.id} className="flex items-center space-x-2">
                            <div className="w-24 text-sm text-gray-400 truncate">{option.text}</div>
                            <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-right text-sm text-gray-300">{percentage.toFixed(0)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openEditModal(poll)}
                      className="flex-1 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 border border-gray-700/50 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-sm font-medium">Edit</span>
                    </button>

                    {poll.isActive ? (
                      <button
                        onClick={() => handleClosePoll(poll._id)}
                        className="flex-1 px-4 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-xl transition-all duration-200 border border-yellow-500/30 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span className="text-sm font-medium">Close</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopenPoll(poll._id)}
                        className="flex-1 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all duration-200 border border-green-500/30 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        <span className="text-sm font-medium">Reopen</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeletePoll(poll._id)}
                      className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-200 border border-red-500/30 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {(showCreateModal || editingPoll) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-gray-900/80 border border-gray-800/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPoll ? 'Edit Poll' : 'Create New Poll'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPoll(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-800/50 rounded-xl transition-all"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PollForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={editingPoll ? handleUpdatePoll : handleCreatePoll}
              submitText={editingPoll ? 'Update Poll' : 'Create Poll'}
              resetForm={resetForm}
              setShowCreateModal={setShowCreateModal}
              setEditingPoll={setEditingPoll}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;