const express = require('express');
const router = express.Router();

router.get('/sign_up', async (req, res) => {
  res.render('register');
});

module.exports = router; 


