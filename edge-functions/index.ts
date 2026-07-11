import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    // Allow POST requests only
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method not allowed.",
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
      }
    );

    // Verify authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Authentication required.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse request body
    const body = await req.json();

    const {
      product_id,
      project_name,
    } = body;

    // Validate required fields
    if (!product_id || !project_name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "product_id and project_name are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify authenticated customer exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Customer profile not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify customer role
    if (profile.role !== "customer") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Only customers can create projects.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, active, approval_status, vendor_id")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify product is active
    if (!product.active) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product is inactive.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify product is approved
    if (product.approval_status !== "approved") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product is not approved.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

        // Verify merchant exists
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("id, status, approval_status")
      .eq("id", product.vendor_id)
      .single();

    if (vendorError || !vendor) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Merchant not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify merchant is active
    if (vendor.status !== "active") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Merchant is inactive.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify merchant is approved
    if (vendor.approval_status !== "approved") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Merchant is not approved.",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

       // Create project
    const { data: projectId, error: projectError } = await supabase.rpc(
      "create_project_transaction",
      {
        p_customer_id: user.id,
        p_product_id: product.id,
        p_vendor_id: vendor.id,
        p_title: project_name,
        p_description: null,
      }
    );

    if (projectError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create project.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Project created successfully.",
        data: {
          project_id: projectId,
          vendor_id: vendor.id,
          status: "created",
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );  
    } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});