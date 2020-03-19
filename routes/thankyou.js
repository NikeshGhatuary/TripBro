const express = require('express');
const router = express.Router();

router.get('/thankyou', async (req, res) => {
  res.render('thankyou');
});

module.exports = router; 


