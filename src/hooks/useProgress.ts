import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

export interface Progress {
  points: number;
  level: number;
  achievements: string[];
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load progress
  useEffect(() => {
    if (!user) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setProgress(data);
      } catch (error) {
        console.error('Error loading progress:', error);
        toast({
          title: "Error loading progress",
          description: "Your progress couldn't be loaded. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('scores')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scores',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setProgress(payload.new as Progress);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Save progress with debounce
  const saveProgress = async (newProgress: Progress) => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('scores')
        .upsert({
          user_id: user.id,
          ...newProgress,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error saving progress",
        description: "Your progress couldn't be saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    progress,
    isLoading,
    isSaving,
    saveProgress,
  };
}