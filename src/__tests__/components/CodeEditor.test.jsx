// src/__tests__/components/CodeEditor.test.jsx
import { render, screen } from '@testing-library/react';
import CodeEditor from '../../components/modules/development/CodeEditor';
import { expect, test, describe, vi } from 'vitest';

// Mock child components that might be problematic in jsdom
vi.mock('../../components/modules/development/CodeEditor/components', () => ({
  FileTabs: () => <div data-testid="file-tabs">FileTabs</div>,
  FileExplorer: () => <div data-testid="file-explorer">FileExplorer</div>,
  LivePreview: () => <div data-testid="live-preview">LivePreview</div>,
  GitPanel: () => <div data-testid="git-panel">GitPanel</div>,
  CollaborationPanel: () => <div data-testid="collaboration-panel">CollaborationPanel</div>,
  SnippetsPanel: () => <div data-testid="snippets-panel">SnippetsPanel</div>,
  CommandPalette: () => <div data-testid="command-palette">CommandPalette</div>,
  MonacoEditor: () => <div data-testid="monaco-editor"><textarea /></div>,
  Terminal: () => <div data-testid="terminal">Terminal</div>,
  StatusBar: () => <div data-testid="status-bar">StatusBar</div>,
  Header: () => <div data-testid="header">Header</div>
}));

describe('CodeEditor', () => {
  test('renderiza el editor correctamente', () => {
    render(<CodeEditor />);
    // The textbox is inside MonacoEditor mock
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
