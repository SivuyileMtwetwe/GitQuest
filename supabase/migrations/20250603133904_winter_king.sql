/*
  # Add unique constraint to scores table

  1. Changes
    - Add unique constraint on user_id column in scores table to prevent duplicate entries
    
  2. Security
    - No changes to security policies
*/

-- Add unique constraint to user_id column
ALTER TABLE scores
ADD CONSTRAINT scores_user_id_key UNIQUE (user_id);