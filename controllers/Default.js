'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.feedOffsetGET = function feedOffsetGET (req, res, next, offset) {
  Default.feedOffsetGET(offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 401);
    });
};

module.exports.loginPOST = function loginPOST (req, res, next, body) {
  Default.loginPOST(body)
    .then(function (response) {
      console.log(`receiving user object`)
      console.log(response);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      console.log(`error occurred ${response}`)
      utils.writeJson(res, response, 401);
    });
};

module.exports.logoutPOST = function logoutPOST (req, res, next) {

  Default.logoutPOST(req.get(`X-API-KEY`))
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 401);
    });
};

module.exports.postIdGET = function postIdGET (req, res, next, id) {
  Default.postIdGET(id, req.get(`X-API-KEY`))
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 401);
    });
};

module.exports.signupPOST = function signupPOST (req, res, next, body) {
  Default.signupPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 500);
    });
};

module.exports.storyPOST = function storyPOST (req, res, next, body) {
  Default.storyPOST(body, req.get(`X-API-KEY`))
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 401);
    });
};
