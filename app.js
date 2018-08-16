var express = require('express');
var lodash = require('lodash');
var app = express();
var clearbit = require('clearbit')('sk_ed6e1a6ab3f33c805df5781f16b7e202');
var https = require('https');
var http = require('http');
var flatten = require('flat');

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
    // console.log("line 83, log within post_to_tealium", data);
    post_req.write(JSON.stringify(data));
    post_req.end();
  } catch (e) {
    console.log(e);
  }
};

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.post('/enrich', function(req, res) {
  let email_address = req.body.email;
  let teal_data = {};
  clearbit.Enrichment.find({email: `'${email_address}'`, stream: true})
    .then(function(response) {
      var person = response.person;
      var company = response.company;
      console.log(person, company);
      teal_data.merge(person, company);
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
// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
