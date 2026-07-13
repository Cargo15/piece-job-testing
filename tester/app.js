// ==========================================
// Piece Job Developer Console
// ==========================================

let selectedFunction = null;

let executionLogs = [];

// ------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    () => {

        renderFunctionList();

        wireSearch();

        loadExecutionLogs();

    }

);

// ------------------------------------------

function renderFunctionList(functions = edgeFunctions) {

    const container =
        document.getElementById("functionList");

    container.innerHTML = "";

    const categories = {};

    functions.forEach(fn => {

        if (!categories[fn.category]) {

            categories[fn.category] = [];

        }

        categories[fn.category].push(fn);

    });

    Object.keys(categories).forEach(category => {

        const heading =
            document.createElement("h4");

        heading.innerText =
            category;

        heading.className =
            "functionCategory";

        container.appendChild(heading);

        categories[category].forEach(fn => {

            const button =
                document.createElement("button");

            button.className =
                "functionButton";

            button.innerText =
                fn.label;

            if (

                selectedFunction &&

                selectedFunction.id === fn.id

            ) {

                button.classList.add("active");

            }

            button.onclick = () => {

                selectFunction(fn);

                renderFunctionList(functions);

            };

            container.appendChild(button);

        });

    });

}

// ------------------------------------------

function selectFunction(fn) {

    selectedFunction = fn;

    document.getElementById(
        "requestEditor"
    ).value = JSON.stringify(

        fn.template,

        null,

        4

    );

    document.getElementById(
        "executionStatus"
    ).innerText =
        "Ready to execute: " + fn.label;

}

// ------------------------------------------
// Execute Selected Function
// ------------------------------------------

document
    .getElementById("executeButton")
    .addEventListener(

        "click",

        async () => {

            if (!selectedFunction) {

                alert("Please select an Edge Function.");

                return;

            }

            const status =
                document.getElementById(
                    "executionStatus"
                );

            const responseViewer =
                document.getElementById(
                    "responseViewer"
                );

            const logPanel =
                document.getElementById(
                    "logPanel"
                );

            try {

                status.innerText = "Executing...";
                const executeButton =
    document.getElementById(
        "executeButton"
    );

executeButton.disabled = true;

executeButton.innerText =
    "Executing...";

               let payload;

try {

    payload = JSON.parse(

        document.getElementById(
            "requestEditor"
        ).value

    );

}

catch (jsonError) {

    status.innerText =
        "❌ Invalid JSON";

    responseViewer.textContent =
        "JSON Validation Failed\n\n" +
        jsonError.message;

    return;

}

const result =
    await executeFunction(

        selectedFunction.id,

        payload

    );

                responseViewer.textContent =
                    JSON.stringify(

                        result.body,

                        null,

                        4

                    );

                status.innerText =
    `${getStatusBadge(result.status)} • ${result.executionTime} ms`;
    executeButton.disabled = false;

executeButton.innerText =
    "Execute Function";

     executionLogs.push(

    {

        timestamp:
            new Date().toLocaleTimeString(),

        functionId:
            selectedFunction.id,

        functionLabel:
            selectedFunction.label,

        request:
            payload,

        response:
            result.body,

        status:
            result.status,

        executionTime:
            result.executionTime

    }

);

renderExecutionLogs();

renderExecutionstatistics();

localStorage.setItem(

    "piecejob_execution_logs",

    JSON.stringify(
        executionLogs
    )

);

            }

            catch (error) {

    status.innerText =
        "🔴 Execution Failed";

    responseViewer.textContent =
        error.message;

}

finally {

    executeButton.disabled = false;

    executeButton.innerText =
        "Execute Function";

}

}

);
    


// ------------------------------------------
// Function Search
// ------------------------------------------

function wireSearch() {

    const search =
        document.getElementById(
            "functionSearch"
        );

    search.addEventListener(

        "input",

        () => {

            const value =
                search.value
                    .toLowerCase()
                    .trim();

            const filtered =
                edgeFunctions.filter(

                    fn =>

                        fn.label
                            .toLowerCase()
                            .includes(value)

                );

            renderFunctionList(filtered);

        }

    );

}
// ------------------------------------------
// Pretty JSON Formatting
// ------------------------------------------

document
    .getElementById("requestEditor")
    .addEventListener(

        "blur",

        () => {

            const editor =
                document.getElementById(
                    "requestEditor"
                );

            try {

                const formatted =
                    JSON.stringify(

                        JSON.parse(
                            editor.value
                        ),

                        null,

                        4

                    );

                editor.value =
                    formatted;

            }

            catch {

                // Invalid JSON
                // Leave exactly as typed

            }

        }

    );
    // ------------------------------------------
// HTTP Status Badge
// ------------------------------------------

function getStatusBadge(status) {

    if (status >= 200 && status < 300) {

        return `🟢 ${status} OK`;

    }

    if (status >= 300 && status < 400) {

        return `🔵 ${status} Redirect`;

    }

    if (status >= 400 && status < 500) {

        return `🟡 ${status} Client Error`;

    }

    return `🔴 ${status} Server Error`;

}
// ------------------------------------------
// Clear Response
// ------------------------------------------

document
    .getElementById("clearResponseButton")
    .addEventListener(

        "click",

        () => {

            document.getElementById(
                "responseViewer"
            ).textContent =
                "Waiting...";

            document.getElementById(
                "executionStatus"
            ).innerText =
                "Ready";

        }

    );

// ------------------------------------------
// Clear Execution Log
// ------------------------------------------

document
    .getElementById("clearLogButton")
    .addEventListener(

        "click",

    () => {

    executionLogs = [];

    renderExecutionLogs();

    renderExecutionstatistics();

    localStorage.removeItem(
        "piecejob_execution_logs"
    );

}

    );
    // ------------------------------------------
// Copy Request
// ------------------------------------------

document
    .getElementById("copyRequestButton")
    .addEventListener(

        "click",

        async () => {

            const request =
                document.getElementById(
                    "requestEditor"
                ).value;

            try {

                await navigator.clipboard.writeText(
                    request
                );

                alert("Request copied to clipboard.");

            }

            catch (error) {

                alert(
                    "Unable to copy request."
                );

                console.error(error);

            }

        }

    );

// ------------------------------------------
// Copy Response
// ------------------------------------------

document
    .getElementById("copyResponseButton")
    .addEventListener(

        "click",

        async () => {

            const response =
                document.getElementById(
                    "responseViewer"
                ).textContent;

            try {

                await navigator.clipboard.writeText(
                    response
                );

                alert("Response copied to clipboard.");

            }

            catch (error) {

                alert(
                    "Unable to copy response."
                );

                console.error(error);

            }

        }

    );

    // ------------------------------------------
// Copy Request
// ------------------------------------------

document
    .getElementById("copyRequestButton")
    .addEventListener(

        "click",

        async () => {

            const request =
                document.getElementById(
                    "requestEditor"
                ).value;

            try {

                await navigator.clipboard.writeText(
                    request
                );

                alert("Request copied to clipboard.");

            }

            catch (error) {

                alert(
                    "Unable to copy request."
                );

                console.error(error);

            }

        }

    );

// ------------------------------------------
// Copy Response
// ------------------------------------------

document
    .getElementById("copyResponseButton")
    .addEventListener(

        "click",

        async () => {

            const response =
                document.getElementById(
                    "responseViewer"
                ).textContent;

            try {

                await navigator.clipboard.writeText(
                    response
                );

                alert("Response copied to clipboard.");

            }

            catch (error) {

                alert(
                    "Unable to copy response."
                );

                console.error(error);

            }

        }

    );
    // ------------------------------------------
// Export Execution Log
// ------------------------------------------

document
    .getElementById("exportLogButton")
    .addEventListener(

        "click",

        () => {

            const log =
                document.getElementById(
                    "logPanel"
                ).innerText;

            const blob =
                new Blob(

                    [log],

                    {

                        type: "text/plain"

                    }

                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `execution-log-${Date.now()}.txt`;

            link.click();

            URL.revokeObjectURL(url);

        }

    );
    // ------------------------------------------
// Download Response JSON
// ------------------------------------------

document
    .getElementById("downloadResponseButton")
    .addEventListener(

        "click",

        () => {

            const response =
                document.getElementById(
                    "responseViewer"
                ).textContent;

            const blob =
                new Blob(

                    [response],

                    {

                        type: "application/json"

                    }

                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `response-${Date.now()}.json`;

            link.click();

            URL.revokeObjectURL(url);

        }

    );

    // ------------------------------------------
// Reset Template
// ------------------------------------------

document
    .getElementById("resetTemplateButton")
    .addEventListener(

        "click",

        () => {

            if (!selectedFunction) {

                alert(
                    "Please select an Edge Function."
                );

                return;

            }

            document.getElementById(
                "requestEditor"
            ).value =
                JSON.stringify(

                    selectedFunction.template,

                    null,

                    4

                );

        }

    );

    // ------------------------------------------
// Format JSON
// ------------------------------------------

document
    .getElementById("formatJsonButton")
    .addEventListener(

        "click",

        () => {

            const editor =
                document.getElementById(
                    "requestEditor"
                );

            try {

                editor.value =
                    JSON.stringify(

                        JSON.parse(
                            editor.value
                        ),

                        null,

                        4

                    );

            }

            catch (error) {

                alert(
                    "The request contains invalid JSON."
                );

            }

        }

    );

    // ------------------------------------------
// Load Persistent Execution Logs
// ------------------------------------------

function loadExecutionLogs() {

    const savedLogs =
        localStorage.getItem(
            "piecejob_execution_logs"
        );

    if (!savedLogs) {

        executionLogs = [];

        renderExecutionLogs();

        return;

    }

    try {

        executionLogs =
            JSON.parse(
                savedLogs
            );

    }

    catch {

        executionLogs = [];

    }

    renderExecutionLogs();

}
// ------------------------------------------
// Render Execution Logs
// ------------------------------------------

function renderExecutionLogs() {

    const logPanel =
        document.getElementById(
            "logPanel"
        );

    if (executionLogs.length === 0) {

        logPanel.innerHTML =
            "No requests yet.";

        return;

    }

    logPanel.innerHTML =
        executionLogs
    .slice()
    .reverse()
    .map((log, index) =>

  `
<div>

<strong>${log.timestamp}</strong><br>

Function: ${log.functionLabel}<br>

HTTP Status: ${log.status}<br>

Execution: ${log.executionTime} ms<br><br>

<button
    class="replayButton"
    onclick="replayRequest(${executionLogs.length - 1 - index})">

    Replay

</button>

<hr>

</div>
`

            )
            .join("");

}

// ------------------------------------------
// Replay Request
// ------------------------------------------

function replayRequest(index) {

    const log =
        executionLogs[index];

    if (!log) {

        return;

    }

    const fn =
        edgeFunctions.find(

            item =>

                item.id ===
                log.functionId

        );

    if (!fn) {

        alert(
            "Edge Function not found."
        );

        return;

    }

    selectedFunction =
        fn;

    renderFunctionList();

    document.getElementById(
        "requestEditor"
    ).value =
        JSON.stringify(

            log.request,

            null,

            4

        );

    document.getElementById(
        "executionStatus"
    ).innerText =
        "Replay ready: " +
        fn.label;

}
// ------------------------------------------
// Render Execution Statistics
// ------------------------------------------

function renderExecutionStatistics() {

    const panel =
        document.getElementById(
            "statisticsPanel"
        );

    if (executionLogs.length === 0) {

        panel.innerHTML =
            "No executions yet.";

        return;

    }

    const total =
        executionLogs.length;

    const successful =
        executionLogs.filter(

            log =>

                log.status >= 200 &&
                log.status < 300

        ).length;

    const failed =
        total - successful;

    const times =
        executionLogs.map(

            log =>

                log.executionTime

        );

    const fastest =
        Math.min(...times);

    const slowest =
        Math.max(...times);

    const average =
        Math.round(

            times.reduce(

                (a, b) => a + b,

                0

            ) / total

        );

    const last =
        executionLogs[
            executionLogs.length - 1
        ];

    panel.innerHTML = `

<strong>Total Requests:</strong> ${total}<br>

<strong>Successful:</strong> ${successful}<br>

<strong>Failed:</strong> ${failed}<br>

<strong>Average Time:</strong> ${average} ms<br>

<strong>Fastest:</strong> ${fastest} ms<br>

<strong>Slowest:</strong> ${slowest} ms<br>

<strong>Last Request:</strong> ${last.timestamp}

`;

}

// ------------------------------------------
// Clear Console Data
// ------------------------------------------

document
    .getElementById("clearConsoleDataButton")
    .addEventListener(

        "click",

        () => {

            executionLogs = [];

            localStorage.removeItem(
                "piecejob_execution_logs"
            );

            renderExecutionLogs();

            renderExecutionStatistics();

            document.getElementById(
                "responseViewer"
            ).textContent =
                "Waiting...";

            document.getElementById(
                "executionStatus"
            ).innerText =
                "Ready";

            if (selectedFunction) {

                document.getElementById(
                    "requestEditor"
                ).value =
                    JSON.stringify(

                        selectedFunction.template,

                        null,

                        4

                    );

            } else {

                document.getElementById(
                    "requestEditor"
                ).value = "";

            }

        }

    );

    // ------------------------------------------
// Reset Statistics
// ------------------------------------------

document
    .getElementById("resetStatisticsButton")
    .addEventListener(

        "click",

        () => {

            renderExecutionStatistics();

        }

    );

    // ------------------------------------------
// Copy Statistics
// ------------------------------------------

document
    .getElementById("copyStatisticsButton")
    .addEventListener(

        "click",

        async () => {

            if (executionLogs.length === 0) {

                await navigator.clipboard.writeText(
                    "No execution statistics available."
                );

                return;

            }

            const total =
                executionLogs.length;

            const successful =
                executionLogs.filter(

                    log =>

                        log.status >= 200 &&
                        log.status < 300

                ).length;

            const failed =
                total - successful;

            const times =
                executionLogs.map(

                    log =>

                        log.executionTime

                );

            const fastest =
                Math.min(...times);

            const slowest =
                Math.max(...times);

            const average =
                Math.round(

                    times.reduce(

                        (a, b) => a + b,

                        0

                    ) / total

                );

            const last =
                executionLogs[
                    executionLogs.length - 1
                ];

            const statistics =

`Piece Job Developer Console

Execution Statistics

Total Requests: ${total}
Successful: ${successful}
Failed: ${failed}
Average Time: ${average} ms
Fastest: ${fastest} ms
Slowest: ${slowest} ms
Last Request: ${last.timestamp}`;

            await navigator.clipboard.writeText(
                statistics
            );

            alert(
                "Execution statistics copied."
            );

        }

    );

    // ------------------------------------------
// API Ping
// ------------------------------------------

document
    .getElementById("apiPingButton")
    .addEventListener(

        "click",

        async () => {

            const result =
                document.getElementById(
                    "apiPingResult"
                );

            result.innerText =
                "Pinging backend...";

            const start =
                performance.now();

            try {

                const response =
                    await fetch(

                        `${SUPABASE_URL}/functions/v1`,

                        {
                            method: "GET",
                            headers: {
                                apikey: SUPABASE_ANON_KEY
                            }
                        }

                    );

                const elapsed =
                    Math.round(

                        performance.now() - start

                    );

                result.innerHTML =

`🟢 Backend Reachable

HTTP Status: ${response.status}

Response Time: ${elapsed} ms`;

            }

            catch (error) {

                result.innerHTML =

`🔴 Backend Unreachable

${error.message}`;

            }

        }

    );

    // ------------------------------------------
// Backend Health
// ------------------------------------------

document
    .getElementById("backendHealthButton")
    .addEventListener(

        "click",

        () => {

            const panel =
                document.getElementById(
                    "backendHealthResult"
                );

            const totalRequests =
                executionLogs.length;

            const authenticated =
                supabase.auth.getSession
                    ? "Available"
                    : "Unavailable";

            panel.innerHTML =

`Developer Console Health

Execution Logs: ${totalRequests}

Storage: Available

Authentication: ${authenticated}

Status: Ready`;

        }

    );