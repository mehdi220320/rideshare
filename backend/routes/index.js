const express = require('express');
const router = express.Router();

const userRoutes = require('../user/user.routes');
const authRoutes = require('../auth/auth.routes');
const triproutes = require('../trip/Triproutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/trips', triproutes);

module.exports = router;
