'use strict';
var logger = require(`../logger`);
const User = require(`../database/models/User`);
const Op = require(`sequelize`).Op;
const { generateSha, generateApiToken, removeUser, isAuthenticated, getUser } = require(`../utils/auth-utils`);
const Story = require("../database/models/Story");
const StoryStats = require(`../database/models/DistinctReaders`);
/**
 * Feed Page
 * Story Title Pagination Endpoint
 *
 * offset Integer 
 * returns List
 **/
exports.feedOffsetGET = function (offset) {
  // return new Promise(function (resolve, reject) {
  //   var examples = {};
  //   examples['application/json'] = [{
  //     "id": 0,
  //     "title": "title"
  //   }, {
  //     "id": 0,
  //     "title": "title"
  //   }];
  //   if (Object.keys(examples).length > 0) {
  //     resolve(examples[Object.keys(examples)[0]]);
  //   } else {
  //     resolve();
  //   }
  // });
  return Story.findAll({
    attributes: ['id', 'title'],
    limit: 10,
    offset: offset *10
  }).then(e => {
    return e.map(x => x.dataValues);
  })
}


/**
 * Login for users
 * This is the login server for users, returns X-API-KEY in response header for authentication
 *
 * body UserCredentials  (optional)
 * returns TokenResponse
 **/
exports.loginPOST = function (body) {
  //   return new Promise(function(resolve, reject) {
  // //     var examples = {};
  // //     examples['application/json'] = {
  // //   "X-API-KEY" : "asadkjfnadkgmadofkapfo"
  // // };
  // //     if (Object.keys(examples).length > 0) {
  // //       resolve(examples[Object.keys(examples)[0]]);
  // //     } else {
  // //       resolve();
  // //     }

  //   });
  console.table(body);
  return User.findOne({
    where: {
      username: body.username,
      password: generateSha(body.password)
    }
  }).then((user) => {
    const token = generateSha(user.username + (new Date()).toISOString());
    const apiToken = generateApiToken(body.username, token);

    return token;
  }).then(res => {
    return {
      "X-API-KEY": res
    }
  })
}


/**
 * Logout of the server
 * This is the logout endpoint for the server
 *
 * no response value expected for this operation
 **/
exports.logoutPOST = function (apiKey) {
  // return new Promise(function (resolve, reject) {
  //   resolve();
  // });
  return removeUser(apiKey);
}


/**
 *
 * id Integer 
 * returns GetStory
 **/
exports.postIdGET = function (id, token) {
  // return new Promise(function (resolve, reject) {
  //   var examples = {};
  //   examples['application/json'] = "";
  //   if (Object.keys(examples).length > 0) {
  //     resolve(examples[Object.keys(examples)[0]]);
  //   } else {
  //     resolve();
  //   }
  // });
  getUser(token).then(userid => {
    if (userid == undefined)
      throw Error(`Userid was undefined`);
    StoryStats.findOrCreate({
      where: {
        statstring: `POST_${id}_USER_${userid}`
      }
    })
  }).catch(err => {
    logger.error(`An Error occurred while updating stats for post ${id}\n ${err}`);
  })

  return Story.findOne({
    where: {
      id: id
    }
  }).then(story => { return story.dataValues }).then((story) => {
    return StoryStats.count({
      where: {
        statstring: {
          [Op.regexp]: `POST_${story.id}_USER_(.*)`
        }
      }
    }).then(count => {
      console.log(`Number of Users read ${count}`);
      console.table(story);
      story[`read`] = count;
      return story;
    })
  }).then(story => {
    var queryDate = new Date();
    const MS_PER_MINUTE = 60000;
    const MINUTE_WINDOW = 1;
    queryDate = new Date(queryDate - MINUTE_WINDOW * MS_PER_MINUTE);
    return StoryStats.count({
      where: {
        statstring: {
          [Op.regexp]: `POST_${story.id}_USER_(.*)`
        },
        updatedAt: {
          [Op.gte]: queryDate.toISOString()
        }
      }
    }).then(count => {
      story[`views`] = count;
      return story;
    })
  })
}


/**
 * Signup Endpoint
 * This is a signup endpoint for the user
 *
 * body UserCredentials  (optional)
 * no response value expected for this operation
 **/
exports.signupPOST = function (body) {
  // return new Promise(function(resolve, reject) {
  //   resolve();
  // });

  return User.findOrCreate({
    where: {
      username: body.username,
      password: generateSha(body.password)
    }
  }).then((user, created) => {
    if (created)
      logger.info(`User ${user.username} created`);
    else logger.info(`User ${user.username} already exists`);
    return {};
  })
}


/**
 * Post a Story
 * Endpoint for posting a story by user
 *
 * body PostStory  (optional)
 * returns GetStory
 **/
exports.storyPOST = function (body, token) {
  // return new Promise(function (resolve, reject) {
  //   var examples = {};
  //   examples['application/json'] = "";
  //   if (Object.keys(examples).length > 0) {
  //     resolve(examples[Object.keys(examples)[0]]);
  //   } else {
  //     resolve();
  //   }
  // });
  return isAuthenticated(token).then(isAuth => {

    console.log(`User authentication ${isAuth}`)
    if (isAuth == undefined || body.title == ""){ 
      console.log(`User is not authenticated ${isAuth}`)
      throw Error(`User not authenticated or body is empty`);
    }
    else return Story.create(body).then((story) => {
      var processStory = story.dataValues;
      processStory[`read`] = 0;
      processStory[`viewers`] = 0;
      console.log(processStory)
      return processStory;
    })
  })
}

