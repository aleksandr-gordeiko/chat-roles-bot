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
  NOT_REGISTERED: 'User is not registered',
  ERROR: 'An error occurred while deleting user',
};

const joinReplyCodes = {
  ADDED: 'Assigned role successfully',
  ALREADY_REGISTERED: 'User already has this role',
  INVALID_ARGUMENT: 'Invalid role',
};

const leaveReplyCodes = {
  DELETED: 'Unassigned role successfully',
  COLLECTION_DOES_NOT_EXIST: 'The role does not exist',
  USER_NOT_IN_COLLECTION: 'User does not have this role',
};

const getRoleReplyCodes = {
  COLLECTION_DOES_NOT_EXIST: 'The role does not exist',
  COLLECTION_EMPTY: 'No users have this role',
};

export {
  registerReplyCodes,
  unregisterReplyCodes,
  showReplyCodes,
  joinReplyCodes,
  leaveReplyCodes,
  getRoleReplyCodes,
};
