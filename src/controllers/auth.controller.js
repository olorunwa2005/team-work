const supabase = require('../config/supabase');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({
    message:
      "Registration successful. Please check your email to verify your account before logging in."
  });
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

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
    session: data.session
  });
};

// ================= RESEND VERIFICATION =================
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

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
