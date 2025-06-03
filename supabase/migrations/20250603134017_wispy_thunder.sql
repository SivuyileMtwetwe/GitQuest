/*
  # Fix duplicate scores and add unique constraint

  1. Changes
    - Remove duplicate scores by keeping only the most recent score for each user
    - Add unique constraint on user_id column
    
  2. Notes
    - Uses a CTE to identify and remove duplicates
    - Keeps the most recent score based on updated_at timestamp
*/

-- First, remove duplicates keeping only the most recent score per user
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
  FROM scores
)
DELETE FROM scores
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE scores
ADD CONSTRAINT scores_user_id_key UNIQUE (user_id);