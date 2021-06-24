const show_reply_codes = {
    NO_USERS_FOUND: "No users registered by now"
}

const register_reply_codes = {
    ADDED: "Added user successfully",
    UPDATED: "Updated user info successfully",
    ALREADY_REGISTERED: "User already registered"
}

const unregister_reply_codes = {
    DELETED: "User deleted successfully",
    ERROR: "An error occurred deleting user"
}

const join_reply_codes = {
    ADDED: "Assigned role successfully",
    ALREADY_REGISTERED: "User already has this role",
    INVALID_ARGUMENT: "Invalid role"
}

const leave_reply_codes = {
    DELETED: "Unassigned role successfully",
    COLLECTION_DOES_NOT_EXIST: "An error occurred deleting user",
    ERROR: "An error occurred while leaving role"
}

export {
    register_reply_codes,
    unregister_reply_codes,
    show_reply_codes,
    join_reply_codes,
    leave_reply_codes
};