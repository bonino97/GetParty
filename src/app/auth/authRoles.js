/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  member: ['admin', 'staff', 'member'],
  onlyGuest: [],
};

export default authRoles;
