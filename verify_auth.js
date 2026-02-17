const BASE_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
  const timestamp = Date.now();
  const email = `testuser_${timestamp}@example.com`;
  const password = 'Password@123';

  console.log(`\nTesting with email: ${email}`);

  // 1. Register
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log(`[REGISTER] Status: ${res.status}`);
    console.log(`[REGISTER] Response:`, data);
  } catch (err) {
    console.error('[REGISTER] Failed:', err.message);
  }

  // 2. Login (Should fail with 403)
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log(`[LOGIN - Unverified] Status: ${res.status} (Expected: 403)`);
    console.log(`[LOGIN - Unverified] Response:`, data);
  } catch (err) {
    console.error('[LOGIN] Failed:', err.message);
  }

  // 3. Resend Verification
  try {
    const res = await fetch(`${BASE_URL}/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    console.log(`[RESEND] Status: ${res.status}`);
    console.log(`[RESEND] Response:`, data);
  } catch (err) {
    console.error('[RESEND] Failed:', err.message);
  }
}

testAuth();
