-- Create a secure function to handle user signup
-- This function runs with SECURITY DEFINER to bypass RLS during signup

CREATE OR REPLACE FUNCTION handle_new_user_signup(
  p_auth_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_facility_name TEXT
)
RETURNS JSON AS $$
DECLARE
  v_facility_id UUID;
  v_user_id UUID;
  v_facility JSON;
  v_user JSON;
BEGIN
  -- Create facility
  INSERT INTO facilities (
    name,
    email,
    timezone,
    subscription_tier,
    settings
  ) VALUES (
    p_facility_name,
    p_email,
    'America/New_York',
    'free',
    jsonb_build_object(
      'kennel_max_minutes', 240,
      'potty_interval_minutes', 120,
      'daily_report_time', '18:00',
      'enable_realtime_updates', true,
      'enable_photo_sharing', true
    )
  )
  RETURNING id INTO v_facility_id;

  -- Create user profile
  INSERT INTO users (
    auth_id,
    facility_id,
    email,
    name,
    role,
    is_active
  ) VALUES (
    p_auth_id,
    v_facility_id,
    p_email,
    p_name,
    'owner',
    true
  )
  RETURNING id INTO v_user_id;

  -- Get the created records
  SELECT row_to_json(f.*) INTO v_facility FROM facilities f WHERE f.id = v_facility_id;
  SELECT row_to_json(u.*) INTO v_user FROM users u WHERE u.id = v_user_id;

  RETURN jsonb_build_object(
    'facility', v_facility,
    'user', v_user
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION handle_new_user_signup TO authenticated;
