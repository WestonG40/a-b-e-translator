'use strict';
const express    = require('express');
const router     = express.Router();
const Translator = require('../components/translator');

router.post('/translate', (req, res) => {
  const { text, locale } = req.body;

  if (text === undefined || locale === undefined) {
    return res.json({ error: 'Required field(s) missing' });
  }

  // Delegate to translator
  const result = Translator.translate(text, locale);

  // If translator returned an error
  if (result.error) {
    return res.json({ error: result.error });
  }

  // Success
  return res.json(result);
});

module.exports = router;

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      
    });
};
