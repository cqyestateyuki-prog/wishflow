/**
 * Account Deletion API / 账号删除接口
 * Permanently deletes the authenticated user's cloud data and auth account.
 * Required for App Store (Guideline 5.1.1(v)) and Play Store compliance.
 *
 * Auth: Bearer <supabase access token>. Uses the service-role key server-side;
 * never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Allow calls from the Capacitor shell (capacitor://localhost) and the web app.
// Safe with '*': auth is a Bearer token, no cookies are involved.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Account deletion is not configured on this server.' },
      { status: 501, headers: CORS_HEADERS }
    );
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json(
      { error: 'Missing access token.' },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json(
      { error: 'Invalid or expired session.' },
      { status: 401, headers: CORS_HEADERS }
    );
  }
  const userId = userData.user.id;

  // connections reference wishes — delete children before parents
  const tables = ['connections', 'fragments', 'wishes', 'user_settings'] as const;
  for (const table of tables) {
    const { error } = await admin.from(table).delete().eq('user_id', userId);
    if (error) {
      console.error(`[API /account/delete] failed to clear ${table}:`, error.message);
      return NextResponse.json(
        { error: `Could not delete your data (${table}). Nothing was removed from your account login — please try again.` },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error('[API /account/delete] failed to delete auth user:', deleteError.message);
    return NextResponse.json(
      { error: 'Your data was removed, but the account login could not be deleted. Please try again.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
