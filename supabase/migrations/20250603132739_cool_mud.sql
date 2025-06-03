/*
  # Add Insert Policy for Scores Table

  1. Changes
    - Add INSERT policy for scores table to allow users to create their initial score record
  
  2. Security
    - Policy ensures users can only insert scores for themselves
    - Maintains existing RLS policies
*/

CREATE POLICY "Users can create their own score"
  ON public.scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);