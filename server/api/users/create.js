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

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error("Supabase admin error", error);
      throw createError({ statusCode: 400, statusMessage: error.message });
    }

    if (!data?.user?.id) {
      throw createError({
        statusCode: 500,
        statusMessage: "User ID missing after signup",
      });
    }

    return { id: data.user.id };
  } catch (error) {
    console.error("Failed to create user", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Server error: " + error.message,
    });
  }
});
