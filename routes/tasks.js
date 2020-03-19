const { Router } = require('express');
const Task = require('../database/Task');

const router = Router();

// router.get('/', (req, res) => {
//   res.send({ message: 'Tasks endpoint working' });
// });

router.get('/', Task.readAll);

module.exports = router;
