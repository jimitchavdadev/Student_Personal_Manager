import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Save } from 'lucide-react';

interface NoteEditorProps {
  selectedPageId: string | null;
  activeNoteTitle: string;
  activeNoteContent: string;
  setActiveNoteTitle: (title: string) => void;
  setActiveNoteContent: (content: string) => void;
  updateNoteContent: () => Promise<void>;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  selectedPageId,
  activeNoteTitle,
  activeNoteContent,
  setActiveNoteTitle,
  setActiveNoteContent,
  updateNoteContent,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save every 10 seconds if there are unsaved changes
  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;

    if (hasUnsavedChanges) {
      autoSaveInterval = setInterval(async () => {
        setIsSaving(true);
        await updateNoteContent();
        setHasUnsavedChanges(false);
        setIsSaving(false);
      }, 10000);
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [hasUnsavedChanges, updateNoteContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveNoteContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveNoteTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    await updateNoteContent();
    setHasUnsavedChanges(false);
    setIsSaving(false);
  };

  return (
    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[calc(100vh-180px)] flex flex-col">
      {selectedPageId ? (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <input
              type="text"
              value={activeNoteTitle}
              onChange={handleTitleChange}
              className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 mr-4"
              placeholder="Note Title"
            />
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-sm text-gray-500">Unsaved changes</span>
              )}
              {isSaving && (
                <span className="text-sm text-blue-500">Saving...</span>
              )}
              <button
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`p-2 rounded-md ${
                  hasUnsavedChanges && !isSaving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <textarea
              value={activeNoteContent}
              onChange={handleContentChange}
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