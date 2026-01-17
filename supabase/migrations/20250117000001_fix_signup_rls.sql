-- Fix RLS policies to allow new user signup
-- The original policies didn't account for the signup flow where:
-- 1. A new auth user is created (no facility yet)
-- 2. A new facility needs to be created
-- 3. A new user profile needs to be created as owner of that facility

-- ============================================================================
-- FACILITIES: Allow authenticated users to create their first facility
-- ============================================================================

-- Allow any authenticated user to create a facility (for signup)
CREATE POLICY "Authenticated users can create facility"
  ON facilities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- USERS: Allow new users to create their profile during signup
-- ============================================================================

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Admins can create users" ON users;

-- Allow users to create their own profile (for signup)
-- This checks that the auth_id matches the current user
CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth_id = auth.uid());

-- Admins/Owners can also create other users in their facility
CREATE POLICY "Admins can create facility users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Either creating own profile (signup)
    auth_id = auth.uid()
    OR
    -- Or admin creating user in their facility
    (
      facility_id = get_user_facility_id(auth.uid())
      AND is_admin_or_owner(auth.uid())
    )
  );

-- ============================================================================
-- FACILITIES: Users should be able to view their own facility after creation
-- ============================================================================

-- Update the select policy to handle newly created facilities
DROP POLICY IF EXISTS "Users can view own facility" ON facilities;

CREATE POLICY "Users can view own facility"
  ON facilities FOR SELECT
  TO authenticated
  USING (
    -- Either via the user's facility_id
    id = get_user_facility_id(auth.uid())
    OR
    -- Or if there's a user record linking to this facility
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.facility_id = facilities.id
      AND u.auth_id = auth.uid()
    )
  );
