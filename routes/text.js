var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('text', { title: 'Express', question: req.flash('question'), jawaban: req.flash('jawaban'), title: req.flash('title'), dokumen: req.flash('dokumen') });
});

module.exports = router;
