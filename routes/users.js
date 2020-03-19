const { Router } = require('express');
const User = require('../database/User');

const router = Router();

// router.get('/', (req, res) => {
//   res.send({ message: 'Users endpoint working' });
// });

router.get('/', User.readAll);

module.exports = router;
