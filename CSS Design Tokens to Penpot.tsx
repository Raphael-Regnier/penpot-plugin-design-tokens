import React, { useState } from 'react';
import { AlertCircle, Upload, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DesignTokensImport = () => {
  const [cssText, setCssText] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleImport = () => {
    if (!cssText.trim()) {
      setStatus('error');
      setMessage('Please enter CSS design tokens');
      return;
    }

    // Send tokens to plugin
    parent.postMessage({ 
      type: 'import-tokens',
      cssText 
    }, '*');
  };

  // Listen for messages from plugin
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
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Import Design Tokens</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="css-input" className="text-sm font-medium">
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
        <Alert className={status === 'success' ? 'bg-green-50' : 'bg-red-50'}>
          <AlertCircle className={status === 'success' ? 'text-green-600' : 'text-red-600'} />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <button
        onClick={handleImport}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Upload size={16} />
        Import Tokens
      </button>
    </div>
  );
};

export default DesignTokensImport;
