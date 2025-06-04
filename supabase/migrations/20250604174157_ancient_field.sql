/*
  # Add unique constraint to scores table
  
  1. Changes
    - Adds unique constraint on user_id column if it doesn't exist
    
  2. Notes
    - Uses DO block to check for constraint existence
    - Prevents duplicate constraint error
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'scores_user_id_key'
  ) THEN
    ALTER TABLE scores
    ADD CONSTRAINT scores_user_id_key UNIQUE (user_id);
  END IF;
END $$;