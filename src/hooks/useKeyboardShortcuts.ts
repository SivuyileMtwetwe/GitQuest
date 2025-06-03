import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const shortcut = shortcuts.find(
        s => s.key === event.key && 
        (!s.ctrlKey || (s.ctrlKey && (event.ctrlKey || event.metaKey)))
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  const showShortcuts = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="mt-2 space-y-2">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex justify-between">
              <span>{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold bg-muted border rounded-lg">
                {shortcut.ctrlKey ? 'Ctrl + ' : ''}{shortcut.key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>
      ),
    });
  };

  return { showShortcuts };
}