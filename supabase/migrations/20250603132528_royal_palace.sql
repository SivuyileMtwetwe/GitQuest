/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Add INSERT policy for authenticated users to create their own profile
    - Add UPDATE policy for users to update their own profile
    - Add SELECT policy for users to read all profiles

  Note: This migration adds the missing RLS policies needed for user profile creation
*/

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read all profiles
CREATE POLICY "Users can read all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);