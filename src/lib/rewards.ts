import { supabase } from "./supabase";

export type Reward = {
  id: string;
  title: string;
  description: string;
  points_required: number;
  image_url?: string;
  status: "active" | "coming_soon" | "locked";
};

export type Redemption = {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  created_at: string;
};

export async function fetchRewards() {
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .order("points_required", { ascending: true });

  if (error) throw error;
  return data as Reward[];
}

export async function fetchDailyCheckins(userId: string) {
  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function claimDailyPoints(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("daily_checkins")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00Z`)
    .lte("created_at", `${today}T23:59:59Z`)
    .single();

  if (existing) {
    throw new Error("Already claimed today!");
  }

  const { error: checkinError } = await supabase
    .from("daily_checkins")
    .insert([{ user_id: userId }]);

  if (checkinError) throw checkinError;

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();

  if (profileErr) throw profileErr;

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ points: (profile?.points || 0) + 5 })
    .eq("id", userId);

  if (updateErr) throw updateErr;

  return { success: true, pointsEarned: 5 };
}

export async function redeemReward(userId: string, rewardId: string, pointsRequired: number) {
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();

  if (profileErr) throw profileErr;

  if ((profile?.points || 0) < pointsRequired) {
    throw new Error("Insufficient points");
  }

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ points: profile.points - pointsRequired })
    .eq("id", userId);

  if (updateErr) throw updateErr;

  const { error: redeemErr } = await supabase
    .from("redemptions")
    .insert([{
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsRequired
    }]);

  if (redeemErr) throw redeemErr;

  return { success: true };
}
