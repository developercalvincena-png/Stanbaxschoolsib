import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { FAQItem } from '../../../types';
import { PlusCircle, Trash2, Edit3, Check, RotateCcw, HelpCircle, Save } from '../../RealIcons';

export const AdminFaqSubTab: React.FC = () => {
  const { faqItems, addFaqItem, updateFaqItem, deleteFaqItem, resetFaqsToDefault, faqContent, updateFaqContent } = useSchool();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState('General');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Admissions');

  const handleStartEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
  };

  const handleSaveEdit = (id: string) => {
    updateFaqItem(id, { question: editQuestion, answer: editAnswer, category: editCategory });
    setEditingId(null);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    addFaqItem({ question: newQuestion, answer: newAnswer, category: newCategory });
    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            Frequently Asked Questions Management
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Configure the public FAQs displayed to parents, prospective scholars, and visitors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetFaqsToDefault}
            className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add New FAQ
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddFaq} className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Add New Question & Answer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Question</label>
              <input
                type="text"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g., What are the school resumption hours?"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Admissions">Admissions</option>
                <option value="Academics">Academics</option>
                <option value="Tuition & Fees">Tuition & Fees</option>
                <option value="Facilities">Facilities & School</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Answer</label>
            <textarea
              rows={3}
              value={newAnswer}
              onChange={e => setNewAnswer(e.target.value)}
              placeholder="Provide a clear, helpful explanation..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
            >
              Publish FAQ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-100">
          {faqItems.map((faq, idx) => (
            <div key={faq.id} className="p-5 hover:bg-stone-50/50 transition-colors">
              {editingId === faq.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={editQuestion}
                      onChange={e => setEditQuestion(e.target.value)}
                      className="sm:col-span-2 px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg font-medium"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={editAnswer}
                    onChange={e => setEditAnswer(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-stone-600 bg-stone-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(faq.id)}
                      className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 rounded-lg flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                        {faq.category}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900">{faq.question}</h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed pl-1">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(faq)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFaqItem(faq.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
