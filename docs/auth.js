// ========================================
// Piece Job Backend Tester Authentication
// ========================================

async function login(email, password) {

    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email: email,
        password: password

    });

    if (error) {

        alert(error.message);
        return null;

    }

    updateUserStatus();

    return data;

}

async function logout() {

    await supabaseClient.auth.signOut();

    updateUserStatus();

}

async function updateUserStatus() {

    const {

        data: { user }

    } = await supabaseClient.auth.getUser();

    const status = document.getElementById("userStatus");

    if (!status) return;

    if (user) {

        status.innerHTML =
            "<strong>" +
            user.email +
            "</strong>";

    } else {

        status.innerHTML =
            "Not Logged In";

    }

}

window.addEventListener(

    "load",

    updateUserStatus

);
// ==========================================
// Authentication UI Wiring
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    if (loginButton) {

        loginButton.addEventListener("click", async () => {

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            await login(email, password);

        });

    }

    if (logoutButton) {

        logoutButton.addEventListener("click", async () => {

            await logout();

        });

    }

});