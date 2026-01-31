export const PollForm = ({
    formData,
    setFormData,
    onSubmit,
    submitText,
    resetForm,
    setShowCreateModal,
    setEditingPoll,
}) => {
    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, ''],
        }));
    };

    const removeOption = (index) => {
        setFormData(prev => {
            if (prev.options.length <= 2) return prev;
            return {
                ...prev,
                options: prev.options.filter((_, i) => i !== index),
            };
        });
    };

    const updateOption = (index, value) => {
        setFormData(prev => {
            const options = [...prev.options];
            options[index] = value;
            return { ...prev, options };
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Poll Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    required
                    placeholder="Enter poll title"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description (optional)
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all min-h-[100px]"
                    placeholder="Enter poll description"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-300">
                        Options *
                    </label>
                    <span className="text-xs text-gray-500">At least 2 required</span>
                </div>
                <div className="space-y-3">
                    {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center text-sm text-gray-400">
                                {index + 1}
                            </div>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            {formData.options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addOption}
                    className="mt-4 flex items-center space-x-2 text-primary-500 hover:text-primary-400 font-medium transition-colors text-white"
                >
                    <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span>Add Option</span>
                </button>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800/50">
                <button
                    type="button"
                    onClick={() => {
                        setShowCreateModal(false);
                        setEditingPoll(null);
                        resetForm();
                    }}
                    className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 border border-gray-700/50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
};
