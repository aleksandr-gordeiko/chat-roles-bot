const showReplyCodes = {
  NO_USERS_FOUND: 'No users registered by now',
};

const registerReplyCodes = {
  ADDED: 'Added user successfully',
  UPDATED: 'Updated user info successfully',
  ALREADY_REGISTERED: 'User already registered',
};

const unregisterReplyCodes = {
  DELETED: 'User deleted successfully',
  ERROR: 'An error occurred deleting user',
};

const joinReplyCodes = {
  ADDED: 'Assigned role successfully',
  ALREADY_REGISTERED: 'User already has this role',
  INVALID_ARGUMENT: 'Invalid role',
};

const leaveReplyCodes = {
  DELETED: 'Unassigned role successfully',
  COLLECTION_DOES_NOT_EXIST: 'An error occurred deleting user',
  ERROR: 'An error occurred while leaving role',
};

export {
  registerReplyCodes,
  unregisterReplyCodes,
  showReplyCodes,
  joinReplyCodes,
  leaveReplyCodes,
};
