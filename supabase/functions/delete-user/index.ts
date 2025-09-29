import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");
    const jwt = authHeader?.split(" ")[1];
    if (!jwt) throw new Error("Missing Authorization token");

    const userClient = createClient(supabaseUrl, anonKey);
    const adminClient = createClient(supabaseUrl, serviceKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser(jwt);
    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    const { error: dataDeleteErr } = await adminClient
      .from("entries")
      .delete()
      .eq("user_id", user.id);
    if (dataDeleteErr) throw dataDeleteErr;

    const { error: userDeleteErr } = await adminClient.auth.admin.deleteUser(
      user.id
    );
    if (userDeleteErr) throw userDeleteErr;

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
