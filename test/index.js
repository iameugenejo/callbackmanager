// test/index.js
var chai = require("chai");
var expect = chai.expect;
var callbackmanager = require("../lib/callbackmanager.js");

describe("#asynchronous callback registers", function() {
	it("waits multiple async callbacks then fire the complete callback", function(done) {
		var cm = new callbackmanager(done);

		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);
		setTimeout(cm.register(), 100);

		cm.done();
	});

	it("executes callback right away if no callbacks are registered", function(done) {
		var cm = new callbackmanager(done);

		cm.done();
	});

	
	it("immediately executes callback when the first error occurs", function(done) {
		var firstError = new Error("first error");
		var lastError = new Error("last error");

		var cm = new callbackmanager(function(err) {
			if(err === firstError)
				done();
			else
				throw new Error("invalid err provided");
		});

		cm.wait();
		setTimeout(function() {
			cm.done(firstError);
		}, 100)

		setTimeout(cm.register(), 200);
		setTimeout(cm.register(), 200);
		setTimeout(cm.register(), 200);
		cm.wait();

		setTimeout(function() {
			cm.done(lastError);
		}, 200);

		cm.done();
	});

	
	it("waits for all async callbacks even if error occurs when continueOnError is true", function(done) {
		var firstError = new Error("first error");
		var lastError = new Error("last error");

		var cm = new callbackmanager(function(err) {
			if(err === lastError)
				done();
			else
				throw new Error("invalid err provided");
		}, true);

		cm.wait();
		setTimeout(function() {
			cm.done(firstError);
		}, 100)

		setTimeout(cm.register(), 200);
		setTimeout(cm.register(), 200);
		setTimeout(cm.register(), 200);
		cm.wait();

		setTimeout(function() {
			cm.done(lastError);
		}, 200);

		cm.done();
	});

	it("does not execute callback when abort is called", function(done) {
		
		var cm = new callbackmanager(function(err) {
			throw new Error("not aborted");
		});

		
		setTimeout(cm.register(), 100);
		cm.wait();
		setTimeout(function() {
			cm.abort();
		}, 200)

		
		setTimeout(cm.register(), 300);
		setTimeout(cm.register(), 400);
		
		setTimeout(function() {
			done();
		}, 500);

		cm.done();
	});

	it("returns number of awaiting callbacks when getCount is called", function(done) {
		
		var cm = new callbackmanager(function(err) {
			expect(cm.getCount()).to.equal(0);
			done();
		});

		expect(cm.getCount()).to.equal(1);
		
		setTimeout(cm.register(), 100);
		expect(cm.getCount()).to.equal(2);

		cm.wait();
		setTimeout(function() {
			expect(cm.getCount()).to.equal(4);	
			cm.done();
		}, 200);
		expect(cm.getCount()).to.equal(3);

		cm.wait();
		setTimeout(function() {
			expect(cm.getCount()).to.equal(3);	
			cm.done();
		}, 300);
		expect(cm.getCount()).to.equal(4);

		cm.wait();
		setTimeout(function() {
			expect(cm.getCount()).to.equal(2);
			cm.done();
		}, 400);
		expect(cm.getCount()).to.equal(5);

		cm.wait();
		setTimeout(function() {
			expect(cm.getCount()).to.equal(1);	
			cm.done();
		}, 500);
		expect(cm.getCount()).to.equal(6);

		cm.done();
		expect(cm.getCount()).to.equal(5);
	});
});