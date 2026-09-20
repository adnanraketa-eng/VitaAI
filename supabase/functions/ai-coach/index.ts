import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message?: string;
  history?: ChatHistoryItem[];
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    // Preserve existing secret name FOOD_AI_API_KEY
    const foodAiApiKey = Deno.env.get("FOOD_AI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in ai-coach function environment");
      return new Response(
        JSON.stringify({ error: "Server configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!foodAiApiKey) {
      console.error("Missing FOOD_AI_API_KEY in ai-coach function environment");
      return new Response(
        JSON.stringify({ error: "AI service configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate user using their own JWT to verify identity and obtain user ID securely
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Parse request payload
    let body: RequestBody = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = body.message?.trim();
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: "A message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

    // Calculate today's date range in ISO strings (covering 00:00:00 to 23:59:59.999)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
    const todayDateStr = now.toISOString().split("T")[0];

    // 2. Fetch User Context securely under RLS
    // A. Core health context: Profiles, Goals, Today's Logs
    // Schema adherence:
    // - water_records: amount_ml, recorded_at, user_id (filter by recorded_at range)
    // - activity_daily_records: activity_date, steps, exercise_minutes (filter by activity_date)
    // - coach_memory: memory_summary, important_preferences, important_constraints, coaching_notes (optional)
    const [
      profileRes,
      wlProfileRes,
      latestWeightRes,
      mealsRes,
      waterRes,
      activityRes,
      coachMemoryRes,
    ] = await Promise.all([
      userClient.from("profiles").select("*").eq("id", userId).maybeSingle(),
      userClient.from("weight_loss_profiles").select("*").eq("user_id", userId).maybeSingle(),
      userClient
        .from("weight_records")
        .select("weight_lb, recorded_at")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      userClient
        .from("meal_log_entries")
        .select("calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, food_name")
        .eq("user_id", userId)
        .gte("recorded_at", startOfDay)
        .lte("recorded_at", endOfDay),
      userClient
        .from("water_records")
        .select("amount_ml, recorded_at")
        .eq("user_id", userId)
        .gte("recorded_at", startOfDay)
        .lte("recorded_at", endOfDay),
      userClient
        .from("activity_daily_records")
        .select("steps, exercise_minutes, activity_date")
        .eq("user_id", userId)
        .eq("activity_date", todayDateStr)
        .maybeSingle(),
      // OPTIONAL coach_memory query with exact schema columns:
      userClient
        .from("coach_memory")
        .select("memory_summary, important_preferences, important_constraints, coaching_notes")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    // Check critical profile/data errors (these indicate broken RLS or fatal DB failure for core tables)
    if (profileRes.error) {
      console.error("Critical: Failed to load user profile:", profileRes.error.message);
      return new Response(
        JSON.stringify({ error: "Failed to load user profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (wlProfileRes.error) {
      console.error("Critical: Failed to load weight loss targets:", wlProfileRes.error.message);
      return new Response(
        JSON.stringify({ error: "Failed to load nutrition targets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle OPTIONAL coach_memory query gracefully:
    // If it fails due to permissions, missing table, or missing row, DO NOT fail the request.
    let coachMemoryText = "";
    if (coachMemoryRes.error) {
      // Log concise warning without sensitive user data, tokens, messages, or health values
      console.warn("[ai-coach] Optional coach_memory query skipped:", coachMemoryRes.error.code || coachMemoryRes.error.message);
    } else if (coachMemoryRes.data) {
      const parts = [];
      if (coachMemoryRes.data.memory_summary) parts.push(`Summary: ${coachMemoryRes.data.memory_summary}`);
      if (coachMemoryRes.data.important_preferences) parts.push(`Preferences: ${coachMemoryRes.data.important_preferences}`);
      if (coachMemoryRes.data.important_constraints) parts.push(`Constraints: ${coachMemoryRes.data.important_constraints}`);
      if (coachMemoryRes.data.coaching_notes) parts.push(`Notes: ${coachMemoryRes.data.coaching_notes}`);
      coachMemoryText = parts.join(" | ");
    }

    // Assemble aggregates safely
    const profile = profileRes.data || {};
    const wlProfile = wlProfileRes.data || {};
    const currentWeight = latestWeightRes.data?.weight_lb || wlProfile.current_weight_lb || "Not recorded";
    const goalWeight = wlProfile.goal_weight_lb || "Not set";
    const targetPace = wlProfile.target_pace || "1 lb / week";
    const calorieGoal = wlProfile.daily_calorie_target || 1800;
    const proteinGoal = wlProfile.daily_protein_target_g || 120;
    const waterGoalL = wlProfile.daily_water_target_ml ? (Number(wlProfile.daily_water_target_ml) / 1000).toFixed(1) : "2.5";
    const stepGoal = wlProfile.daily_step_target || 8500;
    const dietaryPreferences = Array.isArray(wlProfile.food_preferences)
      ? wlProfile.food_preferences.join(", ")
      : "None specified";

    const meals = mealsRes.data || [];
    const totalCalories = meals.reduce((acc: number, m: { calories?: number | null }) => acc + (Number(m.calories) || 0), 0);
    const totalProtein = meals.reduce((acc: number, m: { protein_g?: number | null }) => acc + (Number(m.protein_g) || 0), 0);

    const waterEntries = waterRes.data || [];
    const totalWaterMl = waterEntries.reduce((acc: number, w: { amount_ml?: number | null }) => acc + (Number(w.amount_ml) || 0), 0);
    const totalWaterL = (totalWaterMl / 1000).toFixed(1);

    const steps = activityRes.data?.steps || 0;
    const exerciseMinutes = activityRes.data?.exercise_minutes || 0;

    // 3. Build System Instruction with Real User Context
    const systemPrompt = `
You are the VitaAI Weight Loss & Nutrition AI Coach.
You provide supportive, evidence-based, empathetic, and actionable coaching for healthy weight management, calorie tracking, macros, hydration, and movement.

User Context:
- Name: ${profile.full_name || "Friend"}
- Gender: ${profile.gender || "Not specified"}
- Height: ${profile.height_cm ? `${profile.height_cm} cm` : "Not specified"}
- Current Weight: ${currentWeight} lb
- Goal Weight: ${goalWeight} lb
- Target Pace: ${targetPace}
- Daily Targets: ${calorieGoal} kcal, ${proteinGoal}g protein, ${waterGoalL}L water, ${stepGoal} steps
- Dietary Preferences: ${dietaryPreferences}
- Today's Progress (${todayDateStr}):
  * Calories Logged: ${totalCalories} kcal (Remaining: ${Math.max(0, calorieGoal - totalCalories)} kcal)
  * Protein Logged: ${totalProtein}g / ${proteinGoal}g
  * Water Logged: ${totalWaterL}L / ${waterGoalL}L
  * Steps Logged: ${steps} / ${stepGoal}
  * Exercise Minutes: ${exerciseMinutes} min
${coachMemoryText ? `- Coach Memory Context: ${coachMemoryText}` : ""}

Coaching Guidelines:
1. Ground advice in the user's actual progress numbers and targets shown above.
2. Keep replies concise, warm, highly practical, and formatted cleanly with bullet points where appropriate.
3. Stay strictly within weight loss, wellness, and healthy nutrition coaching. Do not prescribe medical treatments or unsolicited advice for unrelated conditions.
4. If the user asks how to hit their goals, reference their remaining calories/protein/water and suggest realistic options.
`.trim();

    // 4. Construct Gemini Contents Payload
    const geminiContents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    // 5. Call Gemini API using FOOD_AI_API_KEY
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${foodAiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      console.error("Gemini API call failed with status:", geminiRes.status);
      return new Response(
        JSON.stringify({ error: "Failed to generate AI response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();
    const reply =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I'm here to support your weight loss journey. How can I help you reach your goals today?";

    // 6. Return response conforming to contract: { success: true, reply, contextLoaded: true }
    return new Response(
      JSON.stringify({
        success: true,
        reply,
        contextLoaded: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Unexpected error in ai-coach Edge Function:", err instanceof Error ? err.message : err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred while processing your request." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
