'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.state() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.state() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.state() == 2;
  };

  Promise.prototype.value = function () {
    if (this._state === 3 && this._value instanceof Promise) {
      return this._value.value();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._value;
  };

  Promise.prototype.reason = function () {
    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._value;
  };

  Promise.prototype.state = function () {
    if (this._state === 3 && this._value instanceof Promise) {
      return this._value.state();
    }

    return this._state;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.value = undefined;
  Promise.prototype.reason = undefined;
};

Promise.enableSynchronous();
