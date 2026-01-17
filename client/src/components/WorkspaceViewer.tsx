import { useEffect, useMemo, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { createWorkspace, loadWorkspaceState } from '../blockly/workspace.ts';
import {
  savedWorkspaceFiles,
  SavedWorkspaceEntry,
  SavedWorkspaceFile,
  savedWorkspaceBasePath,
} from '../generated/savedWorkspacesPruned.ts';

const fetchWorkspaces = async (file: SavedWorkspaceFile): Promise<SavedWorkspaceEntry[]> => {
  const response = await fetch(`${savedWorkspaceBasePath}/${file}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const WorkspaceViewer = () => {
  const blocklyRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const [selectedFile, setSelectedFile] = useState<SavedWorkspaceFile>(savedWorkspaceFiles[0]);
  const [entriesByFile, setEntriesByFile] = useState<Record<string, SavedWorkspaceEntry[]>>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const entries = useMemo(() => entriesByFile[selectedFile] || [], [entriesByFile, selectedFile]);
  const currentEntry = entries[index];
  const total = entries.length;

  useEffect(() => {
    const container = blocklyRef.current;
    if (!container) return;

    const ws = createWorkspace(container, {
      readOnly: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true },
    });

    workspaceRef.current = ws;
    return () => {
      ws.dispose();
      workspaceRef.current = null;
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);
    fetchWorkspaces(selectedFile)
      .then((loaded) => {
        if (canceled) return;
        setEntriesByFile((prev) => ({ ...prev, [selectedFile]: loaded }));
        setIndex(0);
      })
      .catch((err: Error) => {
        if (canceled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [selectedFile]);

  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;

    try {
      loadWorkspaceState(ws, currentEntry?.workspace ?? null);
      ws.scrollCenter();
    } catch (err) {
      setError((err as Error).message);
    }
  }, [currentEntry]);

  const goPrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setIndex((prev) => Math.min(prev + 1, Math.max(total - 1, 0)));

  if (!savedWorkspaceFiles.length) {
    return <div style={{ padding: 16 }}>No saved workspace files found.</div>;
  }

  return (
    <div id="pageContainer">
      <div style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>Workspace Viewer</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.95rem' }}>File</span>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value as SavedWorkspaceFile)}
            style={{ padding: '6px 8px' }}
          >
            {savedWorkspaceFiles.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={goPrev} disabled={loading || index <= 0}>
            Prev
          </button>
          <button onClick={goNext} disabled={loading || index >= total - 1}>
            Next
          </button>
          <span style={{ fontSize: '0.95rem' }}>
            {loading ? 'Loading…' : total ? `${index + 1} / ${total}` : 'No entries'}
          </span>
        </div>
        {currentEntry?.date && (
          <span style={{ marginLeft: 12, fontSize: '0.95rem' }}>Date: {currentEntry.date}</span>
        )}
        {error && <span style={{ color: 'red', marginLeft: 12 }}>{error}</span>}
      </div>
      <div ref={blocklyRef} style={{ width: '100%', flex: 1 }} />
    </div>
  );
};

export default WorkspaceViewer;
