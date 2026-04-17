import { useState } from 'react';
import { StickyNote, Plus, X } from 'lucide-react';
import { ClinicalNote } from '../data/mockData';
import { format } from 'date-fns';

interface QuickNotesProps {
  patientId: string;
  notes: ClinicalNote[];
  onAddNote: (patientId: string, text: string) => void;
}

export default function QuickNotes({ patientId, notes, onAddNote }: QuickNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleSubmit = () => {
    if (newNote.trim()) {
      onAddNote(patientId, newNote.trim());
      setNewNote('');
      setIsAdding(false);
    }
  };

  const patientNotes = notes.filter(n => n.patientId === patientId);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Clinical Notes</span>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-[#0066CC] hover:text-[#0052a3] flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="border border-gray-300 rounded-md p-2 bg-white">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a quick clinical note..."
            className="w-full text-sm border-none outline-none resize-none"
            rows={2}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-xs bg-[#0066CC] text-white rounded hover:bg-[#0052a3]"
            >
              Save
            </button>
            <button
              onClick={() => {
                setNewNote('');
                setIsAdding(false);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {patientNotes.length > 0 && (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {patientNotes.map((note) => (
            <div key={note.id} className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-gray-800">{note.text}</p>
              <p className="text-gray-500 mt-1">
                {note.author} · {format(new Date(note.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
