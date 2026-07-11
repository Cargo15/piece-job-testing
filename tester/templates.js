// ==========================================
// Piece Job Developer Console
// Edge Function Registry
// ==========================================

const edgeFunctions = [

    {

        id: "create-project",

        label: "Create Project",

        category: "Projects",

        template: {

            product_id: "",

            title: "",

            description: ""

        }

    },

    {

        id: "update-project",

        label: "Update Project",

        category: "Projects",

        template: {

            project_id: "",

            title: "",

            description: ""

        }

    },

    {

        id: "cancel-project",

        label: "Cancel Project",

        category: "Projects",

        template: {

            project_id: ""

        }

    },

    {

        id: "get-project",

        label: "Get Project",

        category: "Projects",

        template: {

            project_id: ""

        }

    },

    {

        id: "list-projects",

        label: "List Projects",

        category: "Projects",

        template: {}

    },

    {

        id: "generate-ai-visualization",

        label: "Generate AI Visualization",

        category: "AI",

        template: {

            project_id: ""

        }

    },

    {

        id: "request-quote",

        label: "Request Quote",

        category: "Quotes",

        template: {

            project_id: ""

        }

    },

    {

        id: "submit-quote",

        label: "Submit Quote",

        category: "Quotes",

        template: {

            quote_id: ""

        }

    },

    {

        id: "accept-quote",

        label: "Accept Quote",

        category: "Quotes",

        template: {

            quote_id: ""

        }

    },

    {

        id: "decline-quote",

        label: "Decline Quote",

        category: "Quotes",

        template: {

            quote_id: ""

        }

    },

    {

        id: "update-project-status",

        label: "Update Project Status",

        category: "Projects",

        template: {

            project_id: "",

            status: ""

        }

    },

    {

        id: "complete-project",

        label: "Complete Project",

        category: "Projects",

        template: {

            project_id: ""

        }

    },

    {

        id: "send-notification",

        label: "Send Notification",

        category: "Notifications",

        template: {

            user_id: "",

            message: ""

        }

    },

    {

        id: "admin-broadcast",

        label: "Admin Broadcast",

        category: "Admin",

        template: {

            message: ""

        }

    }

];