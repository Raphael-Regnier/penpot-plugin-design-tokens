import { PenpotColor, PenpotTypography } from '@penpot/plugin-types';

interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'typography';
}

// Initialize plugin
penpot.ui.open("Design Tokens Import", "", {
  width: 400,
  height: 600
});

// Handle messages from the UI
penpot.ui.onMessage(async (msg) => {
  if (msg.type === 'import-tokens') {
    try {
      const tokens = parseDesignTokens(msg.cssText);
      
      for (const token of tokens) {
        if (token.type === 'color') {
          await penpot.library.local.createColor(createPenpotColor(token));
        } else if (token.type === 'typography') {
          await penpot.library.local.createTypography(createPenpotTypography(token));
        }
      }
      
      penpot.ui.sendMessage({ type: 'import-complete', count: tokens.length });
    } catch (error) {
      console.error('Error processing tokens:', error);
    }
  }
});

// Helper functions
function parseDesignTokens(cssText: string): DesignToken[] {
  const tokens: DesignToken[] = [];
  const colorRegex = /--([^:]+):\s*(#[0-9A-Fa-f]{6}|rgb\([^)]+\)|rgba\([^)]+\))/g;
  const typographyRegex = /--([^:]+):\s*([^;]+)(font-family|font-size|font-weight|line-height)/g;
  
  let match;
  
  while ((match = colorRegex.exec(cssText)) !== null) {
    tokens.push({
      name: match[1].trim(),
      value: match[2].trim(),
      type: 'color'
    });
  }
  
  while ((match = typographyRegex.exec(cssText)) !== null) {
    tokens.push({
      name: match[1].trim(),
      value: match[2].trim(),
      type: 'typography'
    });
  }
  
  return tokens;
}

function createPenpotColor(token: DesignToken): PenpotColor {
  return {
    name: token.name,
    color: token.value,
    opacity: 1
  };
}

function createPenpotTypography(token: DesignToken): PenpotTypography {
  const fontProperties = token.value.split(';');
  return {
    name: token.name,
    fontFamily: fontProperties.find(p => p.includes('font-family'))?.split(':')[1]?.trim() || 'Inter',
    fontSize: parseInt(fontProperties.find(p => p.includes('font-size'))?.split(':')[1]?.trim() || '16'),
    fontWeight: parseInt(fontProperties.find(p => p.includes('font-weight'))?.split(':')[1]?.trim() || '400'),
    lineHeight: parseInt(fontProperties.find(p => p.includes('line-height'))?.split(':')[1]?.trim() || '1.5')
  };
}
