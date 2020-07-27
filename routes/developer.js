const express = require('express');
const router = express.Router();

router.get('/developer', async (req, res) => {
  res.render('developer');
});

module.exports = router; 


