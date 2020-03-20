const { Router } = require('express');

const router = Router();

// eslint-disable-next-line no-unused-vars
router.get('/', (req, res) => {
  res.send({ message: 'Home endpoint working' });
});

module.exports = router;
