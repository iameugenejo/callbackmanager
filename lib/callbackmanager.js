// lib/callbackmanager.js
/**
 * Asynchronous Callback Manager
 *
 * @param	{Function}	completeCallback	callback to be called after finishing all registered callbacks
 * @param	{Boolean}	[continueOnError]	flag to indicate if completeCallback should be exected after finishing all async callbacks even after an error
 * @desc	Instantiating this class considers itself an awaiting callback. Call done() after registering all callbacks.
 **/
 
module.exports = function(completeCallback, continueOnError) {
	var waitingCount = 1;
	var abort = false;
	var lastError = null;

	this.getCount = function() {
		return waitingCount;
	}

	this.wait = function() {
		waitingCount++;
	};

	this.abort = function() {
		abort = true;
	}

	this.register = function() {
		waitingCount++;

		return this.done;
	};

	this.done = function(err) {
		if(abort)
			return;

		if(err && !continueOnError) {
			abort = true;

			return completeCallback(err);
		}

		if(err)
			lastError = err;

		if(--waitingCount <= 0) {
			completeCallback(lastError);
		}
	}
}
