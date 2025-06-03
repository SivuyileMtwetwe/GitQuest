/*
  # Create profiles and scores tables

  1. New Tables
    - profiles: Stores user profile information
      - id (uuid, primary key)
      - username (text, unique)
      - avatar_url (text)
      - created_at (timestamp)
      
    - scores: Stores user scores and progress
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - points (integer)
      - level (integer)
      - achievements (jsonb)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  achievements jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Scores policies
CREATE POLICY "Users can read all scores"
  ON scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own score"
  ON scores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for scores
CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for leaderboard queries
CREATE INDEX scores_points_idx ON scores (points DESC);