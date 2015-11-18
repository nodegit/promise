var assert = require('better-assert');
var Promise = require('../');

describe('synchronous-inspection-tests', function () {
  it.skip('cannot synchronously inspect before enabling synchronous inspection', function(done) {
    var finished = null;
    var fulfilledPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 10);
    });
    var rejectedPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject();
      }, 10);
    });

    assert(fulfilledPromise.value == undefined);
    assert(fulfilledPromise.getValue == undefined);
    assert(fulfilledPromise.reason == undefined);
    assert(fulfilledPromise.getReason == undefined);
    assert(fulfilledPromise.isFulfilled == undefined);
    assert(fulfilledPromise.isPending == undefined);
    assert(fulfilledPromise.isRejected == undefined);

    assert(rejectedPromise.value == undefined);
    assert(rejectedPromise.getValue == undefined);
    assert(rejectedPromise.reason == undefined);
    assert(rejectedPromise.getReason == undefined);
    assert(rejectedPromise.isFulfilled == undefined);
    assert(rejectedPromise.isPending == undefined);
    assert(rejectedPromise.isRejected == undefined);

    setTimeout(function() {
      assert(fulfilledPromise.value == undefined);
      assert(fulfilledPromise.getValue == undefined);
      assert(fulfilledPromise.reason == undefined);
      assert(fulfilledPromise.getReason == undefined);
      assert(fulfilledPromise.isFulfilled == undefined);
      assert(fulfilledPromise.isPending == undefined);
      assert(fulfilledPromise.isRejected == undefined);

      assert(rejectedPromise.value == undefined);
      assert(rejectedPromise.getValue == undefined);
      assert(rejectedPromise.reason == undefined);
      assert(rejectedPromise.getReason == undefined);
      assert(rejectedPromise.isFulfilled == undefined);
      assert(rejectedPromise.isPending == undefined);
      assert(rejectedPromise.isRejected == undefined);

      done();
    }, 30);

  });

  it('can poll a promise to see if it is resolved', function (done) {
    Promise.enableSynchronous();
    var finished = null;
    var fulfilledPromise = new Promise(function(resolve, reject) {
      var interval = setInterval(function() {
        if (finished !== null) {
          clearTimeout(interval);

          if (finished) {
            resolve(true);
          }
          else {
            reject(false);
          }
        }
      }, 10);
    });

    assert(fulfilledPromise.getState() === 0);
    assert(fulfilledPromise.isPending());
    assert(!fulfilledPromise.isFulfilled());
    assert(!fulfilledPromise.isRejected());

    finished = true;

    setTimeout(function () {
      assert(fulfilledPromise.getState() === 1);
      assert(fulfilledPromise.isFulfilled());
      assert(!fulfilledPromise.isRejected());
      assert(fulfilledPromise.getValue());
      assert(fulfilledPromise.value());
      assert(!fulfilledPromise.isPending());

      done();
    }, 30);
  });

  it('can poll a promise to see if it is rejected', function (done) {
    Promise.enableSynchronous();
    var finished = null;
    var fulfilledPromise = new Promise(function(resolve, reject) {
      var interval = setInterval(function() {
        if (finished !== null) {
          clearTimeout(interval);

          if (finished) {
            resolve(true);
          }
          else {
            reject(false);
          }
        }
      }, 10);
    });

    assert(fulfilledPromise.getState() === 0);
    assert(fulfilledPromise.isPending());
    assert(!fulfilledPromise.isFulfilled());
    assert(!fulfilledPromise.isRejected());

    finished = false;

    setTimeout(function () {
      assert(fulfilledPromise.getState() === 2);
      assert(!fulfilledPromise.isFulfilled());
      assert(fulfilledPromise.isRejected());
      assert(!fulfilledPromise.getReason());
      assert(!fulfilledPromise.reason());
      assert(!fulfilledPromise.isPending());

      done();
    }, 30);
  });

  it('will throw an error if getting a value of an unfulfilled promise', function (done) {
    Promise.enableSynchronous();
    var finished = null;
    var fulfilledPromise = new Promise(function(resolve, reject) {
      var interval = setInterval(function() {
        if (finished !== null) {
          clearTimeout(interval);

          if (finished) {
            resolve(true);
          }
          else {
            reject(false);
          }
        }
      }, 10);
    });

    assert(fulfilledPromise.isPending());
    assert(!fulfilledPromise.isFulfilled());
    assert(!fulfilledPromise.isRejected());

    try {
      fulfilledPromise.getValue();
      fulfilledPromise.value();

      assert(false);
    }
    catch (e) {
      assert(true);
    }

    finished = false;

    setTimeout(function () {
      try {
        fulfilledPromise.getValue();
        fulfilledPromise.value();

        assert(false);
      }
      catch (e) {
        assert(true);
      }

      done();
    }, 30);
  });

  it('will throw an error if getting a reason of a non-rejected promise', function (done) {
    Promise.enableSynchronous();
    var finished = null;
    var fulfilledPromise = new Promise(function(resolve, reject) {
      var interval = setInterval(function() {
        if (finished !== null) {
          clearTimeout(interval);

          if (finished) {
            resolve(true);
          }
          else {
            reject(false);
          }
        }
      }, 10);
    });

    assert(fulfilledPromise.isPending());
    assert(!fulfilledPromise.isFulfilled());
    assert(!fulfilledPromise.isRejected());

    try {
      fulfilledPromise.getReason();
      fulfilledPromise.reason();

      assert(false);
    }
    catch (e) {
      assert(true);
    }

    finished = true;

    setTimeout(function () {
      try {
        fulfilledPromise.getReason();
        fulfilledPromise.reason();

        assert(false);
      }
      catch (e) {
        assert(true);
      }

      done()
    }, 30);
  });

  it('can disable synchronous inspection', function() {
    Promise.enableSynchronous();
    var testPromise = Promise.resolve('someValue');
    assert(testPromise.getValue() == 'someValue');
    assert(testPromise.value() == 'someValue');
    Promise.disableSynchronous();
    assert(testPromise.getValue == undefined);
    assert(testPromise.value == undefined);
  });

  it('can synchronously poll a resolving promise chain', function (done) {
    Promise.enableSynchronous();
    var fulfilledPromise = new Promise(function(resolve, reject) {
      var interval = setTimeout(function() {
        resolve(Promise.resolve(true));
      }, 10);
    });

    assert(fulfilledPromise.getState() === 0);
    assert(fulfilledPromise.isPending());
    assert(!fulfilledPromise.isFulfilled());
    assert(!fulfilledPromise.isRejected());

    setTimeout(function() {
      assert(fulfilledPromise.getState() === 1);
      assert(fulfilledPromise.isFulfilled());
      assert(!fulfilledPromise.isRejected());
      assert(fulfilledPromise.getValue());
      assert(!fulfilledPromise.isPending());

      done();
    }, 30);
  });

  it('can synchronously poll a rejecting promise chain', function(done) {
    Promise.enableSynchronous();
    var rejectedPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(Promise.reject(false));
      }, 10);
    });

    assert(rejectedPromise.getState() === 0);
    assert(rejectedPromise.isPending());
    assert(!rejectedPromise.isFulfilled());
    assert(!rejectedPromise.isRejected());

    setTimeout(function() {
      assert(rejectedPromise.getState() === 2);
      assert(!rejectedPromise.isFulfilled());
      assert(rejectedPromise.isRejected());
      assert(!rejectedPromise.getReason());
      assert(!rejectedPromise.isPending());

      done();
    }, 30);
  });
});
