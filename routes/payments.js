const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('payment_gateway');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login/sign_in');
}
module.exports = router; 
