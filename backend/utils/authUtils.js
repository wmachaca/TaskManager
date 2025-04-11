// utils/authUtils.js
const PUBLIC_USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  provider: true,
};

function sanitizeUser(user) {
  if (!user) return null;
  const { auth, authId, ...safeUser } = user; //remove auth and authId
  return safeUser;
}

module.exports = {
  PUBLIC_USER_FIELDS,
  sanitizeUser,
};
