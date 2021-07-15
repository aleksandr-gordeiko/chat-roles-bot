const joinReplyCodes = {
  ADDED: 'Assigned role successfully',
  ALREADY_REGISTERED: 'User already has this role',
  NO_ROLES_IN_CHAT: 'No roles in chat for now',
};

const leaveReplyCodes = {
  DELETED: 'Unassigned role successfully',
  ROLE_DOES_NOT_EXIST: 'The role does not exist',
  USER_NOT_IN_COLLECTION: 'User does not have this role',
};

const getRoleReplyCodes = {
  ROLE_DOES_NOT_EXIST: 'The role does not exist',
  COLLECTION_EMPTY: 'No users have this role',
};

export {
  joinReplyCodes,
  leaveReplyCodes,
  getRoleReplyCodes,
};
