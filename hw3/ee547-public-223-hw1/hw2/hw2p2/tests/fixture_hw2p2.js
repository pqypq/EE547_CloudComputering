'use strict';

const chai = require('chai');
const { expect } = chai;

const { promisify } = require('util');

const SCRIPT_TO_TEST = `${__dirname}/../hw2p2.js`;
// see autograde-Makefile
const BEARER_TOKEN = process.env.BEARER_TOKEN || 'BEARER_TOKEN_HERE';

class Hw2P2Fixture {
  constructor() { 
    this.scriptToTest = SCRIPT_TO_TEST;
  }

  before() {
  }

  after() {
  }


  uut() {
    const { TwitterApi } = require(SCRIPT_TO_TEST);
    return new TwitterApi(BEARER_TOKEN);
  }


  // return a function to validate expected response
  _validator(expectError, expectData, cb) {
    return (err, data) => {
      if (!expectError) {
        expect(err).to.be.null;
      } else {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal(expectError);
      }

      if (!expectData) {
        expect(data).to.not.exist;
      } else {
        expect(data).to.exist;
        expect(data).to.equal(expectData);
      }

      cb();
    }
  }

  throw() {
    throw new Error('should not run');
  }


  // ENTITY HELPERS

  static assert_valid_tweet = (obj) => {
    const fields = [
      'body',
      'createdAt',
      'publicMetrics',
      'tweetId',
      'userId'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }
  }

  static assert_valid_user = (obj) => {
    const fields = [
      'createdAt',
      'description',
      'location',
      'name',
      'publicMetrics',
      'userId',
      'userName',    
      'verified'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }
  }
}




chai.use(function (chai) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('model', function (exp) {
    const self = this;

    const validators = {
      tweet:  Hw2P2Fixture.assert_valid_tweet,
      user:   Hw2P2Fixture.assert_valid_user
    }

    if (!(exp in validators)) {
      throw new Error(`invalid model assertion -- val:${exp}, allowed:${Object.keys(validators).join(',')}`);
    }

    validators[exp](self._obj);
  });
});


module.exports = {
  Fixture: Hw2P2Fixture
}
