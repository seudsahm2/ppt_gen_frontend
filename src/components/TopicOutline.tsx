import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Check, XCircle } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
}

interface TopicOutlineProps {
  topics: Topic[];
  onAddTopic: (title: string, description: string) => void;
  onEditTopic: (id: string, title: string, description: string) => void;
  onRemoveTopic: (id: string) => void;
  onGenerateContent: () => void;
  isGenerating: boolean;
}

const TopicOutline: React.FC<TopicOutlineProps> = ({
  topics,
  onAddTopic,
  onEditTopic,
  onRemoveTopic,
  onGenerateContent,
  isGenerating,
}) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const handleAddTopic = () => {
    if (newTopicTitle.trim() && newTopicDescription.trim()) {
      onAddTopic(newTopicTitle.trim(), newTopicDescription.trim());
      setNewTopicTitle('');
      setNewTopicDescription('');
    }
  };

  const startEditing = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditingTitle(topic.title);
    setEditingDescription(topic.description);
  };

  const cancelEditing = () => {
    setEditingTopicId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const saveEditing = (id: string) => {
    if (editingTitle.trim() && editingDescription.trim()) {
      onEditTopic(id, editingTitle.trim(), editingDescription.trim());
      cancelEditing();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Presentation Outline</h2>

      {/* Add New Topic Section */}
      <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Add New Topic</h3>
        <input
          type="text"
          placeholder="Topic Title (e.g., Introduction to Android Activities)"
          value={newTopicTitle}
          onChange={(e) => setNewTopicTitle(e.target.value)}
          className="w-full p-3 mb-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <textarea
          placeholder="Topic Description (e.g., Covers the fundamental concepts of Android Activities and their role in app structure.)"
          value={newTopicDescription}
          onChange={(e) => setNewTopicDescription(e.target.value)}
          rows={3}
          className="w-full p-3 mb-4 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
        />
        <button
          onClick={handleAddTopic}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center font-semibold text-lg shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Topic
        </button>
      </div>

      {/* Existing Topics List */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Extracted Topics ({topics.length})</h3>
      {topics.length === 0 ? (
        <p className="text-center text-gray-500 italic p-4 bg-gray-50 rounded-lg">No topics extracted yet. Upload a PDF or add one manually!</p>
      ) : (
        <ul className="space-y-4">
          {topics.map((topic) => (
            <li key={topic.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              {editingTopicId === topic.id ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-1 focus:ring-blue-500"
                  />
                  <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-blue-300 rounded-md focus:ring-1 focus:ring-blue-500 resize-y"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => saveEditing(topic.id)}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Cancel"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{topic.title}</h4>
                  <p className="text-gray-700 text-sm mt-1">{topic.description}</p>
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => startEditing(topic)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveTopic(topic.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Generate Content Button */}
      {topics.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={onGenerateContent}
            disabled={isGenerating}
            className={`bg-purple-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg hover:bg-purple-700 transition-colors duration-300
              ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isGenerating ? 'Generating Slides...' : 'Generate Presentation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicOutline;