require('dotenv').config();
const api_key = process.env.clearbit_api_key;
console.log(api_key);
const express = require('express');
const lodash = require('lodash');
const app = express();
const clearbit = require('clearbit')(api_key);
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const flatten = require('flat');
app.use(bodyParser.json());
const tealium_account = 'services-kyle';
const tealium_profile = 'main';



function post_to_tealium(data) {
  try {
    let post_options = {
      host: 'collect.tealiumiq.com',
      port: '80',
      path: '/event',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let post_req = http.request(post_options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`Response: ${chunk}`);
      });
      res.on('end', () => {
        console.log('post_to_tealium done!');
      });
    });
    post_req.write(JSON.stringify(data));
    post_req.end();
  } catch (e) {
    console.log(e);
  }
};

/* app.get('/', function(req, res) {
   res.send({
    "Output": "Hello World!"
   });
}); */

app.post('/enrich', function(req, res) {
  var email_address = req.body.email;
  console.log(email_address);
  var teal_data = {};
  clearbit.Enrichment.find({email: email_address, stream: true})
    .then(function(response) {
      var person = flatten(response.person);
      var company = flatten(response.company);
      console.log(person, company, 'after flattening both response objects');
      var teal_data = Object.assign(person, company);
      console.log(teal_data, 'after merging person and company');
      teal_data.tealium_account = tealium_account;
      teal_data.tealium_profile = tealium_profile;
      teal_data.tealium_visitor_id = email_address;
      console.log(teal_data, 'teal data after adding required keys');
      post_to_tealium(teal_data);
    })
    .catch(function(err) {
      console.error(err);
    });
  });
module.exports = app;
