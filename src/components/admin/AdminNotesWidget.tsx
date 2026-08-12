"use client";

import { useState, useEffect } from "react";
import { StickyNote, CheckSquare, Plus, Trash2, Copy, Check, Sparkles } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export default function AdminNotesWidget() {
  const [notes, setNotes] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Follow up with Google recruiter regarding Senior Full-Stack role", priority: "high", completed: false },
    { id: "2", text: "Add new Next.js 16 microservices project to portfolio showcase", priority: "medium", completed: false },
    { id: "3", text: "Update resume PDF download attachment", priority: "low", completed: true },
  ]);

  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<"high" | "medium" | "low">("medium");
  const [copied, setCopied] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("admin_quick_notes");
    if (savedNotes) setNotes(savedNotes);

    const savedTodos = localStorage.getItem("admin_todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {}
    }
  }, []);

  // Save notes to localStorage
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem("admin_quick_notes", val);
  };

  // Add new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      priority: newTodoPriority,
      completed: false,
    };

    const updated = [newItem, ...todos];
    setTodos(updated);
    localStorage.setItem("admin_todos", JSON.stringify(updated));
    setNewTodoText("");
  };

  // Toggle todo completion
  const handleToggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTodos(updated);
    localStorage.setItem("admin_todos", JSON.stringify(updated));
  };

  // Delete single todo
  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    localStorage.setItem("admin_todos", JSON.stringify(updated));
  };

  // Clear completed todos
  const handleClearCompleted = () => {
    const updated = todos.filter((t) => !t.completed);
    setTodos(updated);
    localStorage.setItem("admin_todos", JSON.stringify(updated));
  };

  // Copy notes to clipboard
  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Notes Scratchpad Card */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-amber-400" /> Admin Quick Scratchpad
            </h3>
            <button
              onClick={handleCopyNotes}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Draft interviewer call notes, record candidate stats, or jot down ideas. Auto-saves locally.
          </p>

          <textarea
            rows={7}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type your notes here... (e.g., Recruiter phone call at 4 PM, salary expectation range, tech stack requirements)"
            className="w-full p-4 rounded-2xl glass-input text-xs leading-relaxed text-slate-200 resize-none"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
          <span>Characters: {notes.length}</span>
          <span className="text-amber-400/80 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Auto-Saved
          </span>
        </div>
      </div>

      {/* Interactive To-Do Checklist Card */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" /> Portfolio To-Do Checklist
            </h3>
            {todos.some((t) => t.completed) && (
              <button
                onClick={handleClearCompleted}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
            />

            <select
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value as any)}
              className="px-2 py-2 rounded-xl glass-input text-xs bg-slate-900 text-white shrink-0"
            >
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Med</option>
              <option value="low">☕ Low</option>
            </select>

            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-colors"
              title="Add Task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Todo List Items */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {todos.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-6">All tasks completed! Great job.</div>
            ) : (
              todos.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    t.completed
                      ? "bg-slate-950/40 border-white/5 opacity-50 line-through text-slate-400"
                      : "bg-slate-900/80 border-slate-800 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={() => handleToggleTodo(t.id)}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => handleToggleTodo(t.id)}
                      className="w-4 h-4 rounded accent-indigo-600 cursor-pointer shrink-0"
                    />

                    <span className="text-xs font-semibold truncate">{t.text}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        t.priority === "high"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : t.priority === "medium"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {t.priority === "high" ? "🔥 High" : t.priority === "medium" ? "⚡ Med" : "☕ Low"}
                    </span>

                    <button
                      onClick={() => handleDeleteTodo(t.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
