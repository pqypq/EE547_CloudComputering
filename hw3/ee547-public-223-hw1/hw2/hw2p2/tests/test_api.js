'use strict';

const { assert, expect } = require('chai');

const DEFAULT_TIMEOUT_MS = 4e3;
const { Fixture } = require('./fixture_hw2p2');

const {
  random_string
} = require('../lib/util');

const { EntityNotFoundError } = require('../error');

const TWEET_ID = {
  EXIST:                  '1492602143705997315',
  EXIST_WITH_RETWEETS:    '1492602143705997315',
  EXIST_WITH_NO_RETWEETS: '1569938072581853184',
  NOT_EXIST:              '200000000'
};

const USER_ID = {
  EXIST:                  '20',
  EXIST_WITH_TIMELINE:    '20',
  EXIST_WITH_NO_TIMELINE: '1568885207968919552',
  NOT_EXIST:              '200000000000'
};

const USERNAME = {
  EXIST:                  'ev',
  EXIST_WITH_TIMELINE:    'ev',
  EXIST_WITH_NO_TIMELINE: 'USC_EE547',
  NOT_EXIST:              'ukjsdkljfasljh'
};

const SEARCH_QUERY = {
  NOT_EMPTY:              'politics',
  EMPTY:                  'ukjsdkljfasljh'
};


describe('twitter api', function () {
  this.timeout(DEFAULT_TIMEOUT_MS);

  const fix = new Fixture();
  
  beforeEach(() => fix.before());
  afterEach(() => fix.after());

  context('getTweet', () => {
    it('tweetId exists', (done) => {
      const uut = fix.uut();

      uut.getTweet(TWEET_ID.EXIST, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.a.model('tweet');

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('tweetId does not exist', (done) => {
      const uut = fix.uut();

      uut.getTweet(TWEET_ID.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('getTimeline', () => {
    it('userId exists, non-empty timeline', (done) => {
      const uut = fix.uut();

      uut.getTimeline(USER_ID.EXIST_WITH_TIMELINE, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.an('array').and.not.be.empty;
          data.forEach(obj => {
            expect(obj).to.be.a.model('tweet');
          });

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userId exists, empty timeline', (done) => {
      const uut = fix.uut();

      uut.getTimeline(USER_ID.EXIST_WITH_NO_TIMELINE, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.an('array').and.be.empty;

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userId does not exist', (done) => {
      const uut = fix.uut();

      uut.getTimeline(USER_ID.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('recentSearch', () => {
    it('search, non-empty response', (done) => {
      const uut = fix.uut();

      uut.recentSearch(SEARCH_QUERY.NOT_EMPTY, (err, data) => {
        try {
          expect(err).to.not.exist;      
          expect(data).to.be.an('array').and.not.be.empty;
          data.forEach(obj => {
            expect(obj).to.be.a.model('tweet');
          });

          done();
        } catch(err) {
          done(err);
        }
      });
    });


    it('search, empty response', (done) => {
      const uut = fix.uut();

      uut.recentSearch(SEARCH_QUERY.EMPTY, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.an('array').and.be.empty;

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('retweetBy', () => {
    it('tweetId exists, non-empty retweets', (done) => {
      const uut = fix.uut();

      uut.retweetBy(TWEET_ID.EXIST_WITH_RETWEETS, (err, data) => {
        try {
          expect(err).to.not.exist;      
          expect(data).to.be.an('array').and.not.be.empty;
          data.forEach(obj => {
            expect(obj).to.be.a.model('user');
          });

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    /*
    it('tweetId exists, empty retweets', (done) => {
      const uut = fix.uut();

      uut.retweetBy(TWEET_ID.EXIST_WITH_NO_RETWEETS, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.an('array').and.be.empty;

          done();
        } catch(err) {
          done(err);
        }
      });      
    });
    */

    it('tweetId does not exist', (done) => {
      const uut = fix.uut();

      uut.retweetBy(TWEET_ID.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('getUser', () => {
    it('userId exists', (done) => {
      const uut = fix.uut();

      uut.getUser(USER_ID.EXIST, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.a.model('user');

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userId does not exist', (done) => {
      const uut = fix.uut();

      uut.getUser(USER_ID.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('getUserByUsername', () => {
    it('userName exists', (done) => {
      const uut = fix.uut();

      uut.getUserByUsername(USERNAME.EXIST, (err, data) => {
        try {
          expect(err).to.not.exist;
          expect(data).to.be.a.model('user');

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userName does not exist', (done) => {
      const uut = fix.uut();

      uut.getUserByUsername(USERNAME.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);

          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });


  context('getTimelineByUsername', () => {
    it('userName exists, non-empty timeline', (done) => {
      const uut = fix.uut();

      uut.getTimelineByUsername(USERNAME.EXIST_WITH_TIMELINE, (err, data) => {
        try {
          expect(err).to.not.exist;      
          expect(data).to.be.an('array').and.not.be.empty;
          data.forEach(obj => {
            expect(obj).to.be.a.model('tweet');
          });

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userName exists, empty timeline', (done) => {
      const uut = fix.uut();

      uut.getTimelineByUsername(USERNAME.EXIST_WITH_NO_TIMELINE, (err, data) => {
        try {
          expect(err).to.not.exist;          
          expect(data).to.be.an('array').and.be.empty;

          done();
        } catch(err) {
          done(err);
        }
      });
    });

    it('userName does not exist', (done) => {
      const uut = fix.uut();

      uut.getTimelineByUsername(USERNAME.NOT_EXIST, (err, data) => {
        try {
          expect(err).to.be.an.instanceof(EntityNotFoundError);
          
          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });
});
