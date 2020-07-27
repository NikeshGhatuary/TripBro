const express = require('express');
const router = express.Router();

router.get('/logged_in', async (req, res) => {
  res.render('TripBro_logged');
});



module.exports = router; 
