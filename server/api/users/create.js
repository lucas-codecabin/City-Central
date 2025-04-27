import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { email, password, fName } = body;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        fName,
      },
      email_confirm: true,
    });

    if (error) {
      console.error("Supabase admin error", error);
    }

    return data.user.id;
  } catch (error) {
    console.error("Failed to create user", error);
  }
});
