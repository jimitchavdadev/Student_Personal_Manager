import React from 'react';
import { BookOpen } from 'lucide-react';

interface NoteEditorProps {
  selectedPageId: string | null;
  activeNoteTitle: string;
  activeNoteContent: string;
  setActiveNoteTitle: (title: string) => void;
  setActiveNoteContent: (content: string) => void;
  updateNoteContent: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  selectedPageId,
  activeNoteTitle,
  activeNoteContent,
  setActiveNoteTitle,
  setActiveNoteContent,
  updateNoteContent,
}) => {
  return (
    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[calc(100vh-180px)] flex flex-col">
      {selectedPageId ? (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <input
              type="text"
              value={activeNoteTitle}
              onChange={(e) => setActiveNoteTitle(e.target.value)}
              onBlur={updateNoteContent}
              className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
              placeholder="Note Title"
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <textarea
              value={activeNoteContent}
              onChange={(e) => setActiveNoteContent(e.target.value)}
              onBlur={updateNoteContent}
              className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
              placeholder="Start typing your note here..."
            ></textarea>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <BookOpen size={64} className="mb-4" />
          <p className="text-lg font-medium">Select a note to view or edit</p>
          <p className="text-sm">Or create a new notebook, section, or page</p>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;