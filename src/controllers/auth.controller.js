const supabase = require('../config/supabase');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Check if username already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 2️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 3️⃣ Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username,
        email,
      });

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({
      message: "Account created successfully. Please verify your email.",
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.user.email_confirmed_at) {
      return res.status(403).json({
        error: "Please verify your email before logging in."
      });
    }

    return res.status(200).json({
      message: "Login successful",
      session: data.session,
      user: data.user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= RESEND VERIFICATION =================
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: "Verification email resent. Please check your inbox."
  });
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/reset-password"
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: "Password reset email sent. Check your inbox."
  });
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  const { access_token, newPassword } = req.body;

  if (!access_token || !newPassword) {
    return res.status(400).json({ error: "Access token and new password are required" });
  }

  const { data, error } = await supabase.auth.updateUser(
    {
      password: newPassword
    },
    {
      accessToken: access_token
    }
  );

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: "Password updated successfully."
  });
};

