
const User = require('../models/Users');
const Role = require('../models/Roles');

exports.checkPermission = (permName) => async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: 'role',
    populate: { path: 'permissions' },
  });

  const hasPermission = user.role.permissions.some(
    (perm) => perm.name === permName
  );

  if (!hasPermission) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }

  next();
};
