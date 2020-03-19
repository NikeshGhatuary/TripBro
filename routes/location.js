const express = require('express');
const router = express.Router();

router.get('/delhi', async (req, res) => {
  res.render('Delhi_hotels');
});
router.get('/mumbai', async (req, res) => {
  res.render('Mumbai_hotels');
});

module.exports = router; 