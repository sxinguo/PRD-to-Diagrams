-- Create deduct_credits function
CREATE OR REPLACE FUNCTION deduct_credits(p_amount INTEGER, p_description TEXT DEFAULT '使用积分')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_current_credits INTEGER;
BEGIN
  -- Get user ID from JWT
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get current credits
  SELECT credits_remaining INTO v_current_credits
  FROM profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Check if enough credits
  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct credits
  UPDATE profiles
  SET credits_remaining = credits_remaining - p_amount
  WHERE id = v_user_id;

  -- Insert into credits_history
  INSERT INTO credits_history (user_id, amount, type, description)
  VALUES (v_user_id, p_amount, 'deduct', p_description);
END;
$$;
