import React, { useState } from 'react';

export const DesignTokensImport: React.FC = () => {
  const [cssText, setCssText] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleImport = () => {
    if (!cssText.trim()) {
      setStatus('error');
      setMessage('Please enter CSS design tokens');
      return;
    }

    parent.postMessage({ 
      type: 'import-tokens',
      cssText 
    }, '*');
  };

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'import-complete') {
        setStatus('success');
        setMessage(`Successfully imported ${event.data.count} design tokens`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Import Design Tokens</h2>
      
      <div className="mb-4">
        <label htmlFor="css-input" className="block text-sm font-medium mb-2">
          Paste your CSS design tokens:
        </label>
        <textarea
          id="css-input"
          className="w-full h-48 p-2 border rounded-md"
          placeholder="Paste CSS variables here..."
          value={cssText}
          onChange={(e) => setCssText(e.target.value)}
        />
      </div>

      {status !== 'idle' && (
        <div className={`p-4 mb-4 rounded-md ${
          status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleImport}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Import Tokens
      </button>
    </div>
  );
};
