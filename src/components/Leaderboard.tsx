import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  points: number;
  level: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select(`
            points,
            level,
            profiles (
              username
            )
          `)
          .order('points', { ascending: false })
          .limit(10);

        if (error) throw error;

        setLeaderboard(
          data.map((entry) => ({
            username: entry.profiles.username,
            points: entry.points,
            level: entry.level,
          }))
        );
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchLeaderboard)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="rounded-xl border bg-white/30 backdrop-blur-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Top Players
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <TableRow key={entry.username}>
              <TableCell className="font-medium">
                {index === 0 && <Medal className="text-yellow-500" />}
                {index === 1 && <Medal className="text-gray-400" />}
                {index === 2 && <Medal className="text-amber-600" />}
                {index > 2 && index + 1}
              </TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell>{entry.level}</TableCell>
              <TableCell className="text-right">{entry.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}