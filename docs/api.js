// ==========================================
// Piece Job Developer Console
// Generic Edge Function Executor
// ==========================================

async function executeFunction(functionName, payload) {

    const {

        data: { session }

    } = await supabaseClient.auth.getSession();

    if (!session) {

        throw new Error("User is not logged in.");

    }

    const started = performance.now();

    const response = await fetch(

        `${SUPABASE_URL}/functions/v1/smart-worker`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization":
                    `Bearer ${session.access_token}`

            },

            body: JSON.stringify({

                action: functionName,

                payload: payload

            })

        }

    );

    const finished = performance.now();

    const body = await response.json();

    return {

        status: response.status,

        ok: response.ok,

        executionTime:

            Math.round(finished - started),

        body

    };

}