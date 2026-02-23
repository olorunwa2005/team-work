const supabase = require('../config/supabase');

exports.completeOnboarding = async (req, res) => {
  try {
    const { id } = req.user;
    const { country, selected_game, activision_id } = req.body;

    if (!country || !selected_game || !activision_id) {
      return res.status(400).json({ error: "Country, selected game, and Activision ID are required" });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        country,
        selected_game,
        activision_id,
        is_onboarded: true,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Onboarding update error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Onboarding completed successfully",
      profile: data[0]
    });
  } catch (err) {
    console.error('Onboarding server error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

