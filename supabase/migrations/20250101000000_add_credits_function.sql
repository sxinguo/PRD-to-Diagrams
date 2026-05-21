-- Create add_credits function
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_credits INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile credits
  UPDATE profiles
  SET
    credits_remaining = COALESCE(credits_remaining, 0) + p_credits,
    total_credits = COALESCE(total_credits, 0) + p_credits
  WHERE id = p_user_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found: %', p_user_id;
  END IF;

  -- Insert into credits_history (bypasses RLS with SECURITY DEFINER)
  INSERT INTO credits_history (user_id, amount, type, description)
  VALUES (p_user_id, p_credits, 'add', '购买积分包');
END;
$$;
