const constants = {
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        TOO_EARLY: 425,
    },
    ALLOWED_ROUTES: {
        path: [
            "/api/user/register",
            "/api/user/login",
            "/api/user/complete-register"
        ]
    },
    MAIN_CATEGORIES: {
        'tasks': true,
        'completed': true,
        'today': true,
    },
};

module.exports = constants;
