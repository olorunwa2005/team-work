const supabase = require('../config/supabase');

exports.completeOnboarding = async (req, res) => {
  const { id } = req.user;
  const { full_name, username, bio, role } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .upsert([
      {
        id,
        full_name,
        username,
        bio,
        role,
        onboarding_completed: true,
      }
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: "Onboarding completed",
    profile: data
  });
};
