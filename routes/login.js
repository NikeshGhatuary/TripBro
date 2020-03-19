const express = require('express');
const router = express.Router();

router.get('/sign_in', async (req, res) => {
  res.render('login');
});



module.exports = router; 
