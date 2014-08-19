callbackmanager
===============

###Simple Asynchronous Callback Manager

####Include : Import a callback manager.

	var CallbackManager = require("callbackmanager");


####Instantiate : Create an instance with the final complete callback

	//NOTE: instantiating is also considered an asynchronous callback. Must call cm.done(); after registering all other callbacks.
	//The first argument is "completeCallback" function. It is executed once all registered callbacks are executed. The first parameter passed to this function is the error parameter passed to cm.done(err) function.
	//The last argument is optional "continueOnError" flag. Set this true if you want all registered callbacks to be executed before calling the complete callback even if error occurs. Note that the error parameter passed to the complete callback is goign to be the last error occured.

	var cm = new CallbackManager(function(err) {
		if(err)
			console.error(err);
		
		console.log("all done!")
	});	


####Register - Simple

	setTimeout(cm.register(), 100);

####Register - Complex : Wait for a callback then notify the manager that it is done

	cm.wait();
	setTimeout(function() {
		//do another async work
		setTimeout(function() {
			cm.done();
		}, 100);
	}, 100);

####Handle error : Pass the error from an async callback to the complete callback
	cm.wait();
	setTimeout(function() {
		cm.done(throw new Error("uh oh!"));
	}, 200);

####Abort : Abort the manager process so that the final callback doesn't get executed

	cm.abort();


####Finalize : Notify manager that the async callback registeration is done

	cm.done();
