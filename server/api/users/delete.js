import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId } = body;

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Supabase admin error", error);
    }
  } catch (error) {
    console.error("Failed to delete user", error);
  }
});
