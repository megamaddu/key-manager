'use strict';

var expect = require('expect.js')

, env      = 'dev'
, app      = 'test'
, keys     = require('../')(app, env)
;

describe('key-manager', function() {

	it('returns keys synchronously', function() {
		expect(keys(app).pub).to.be.ok();
	});

	it('returns keys asynchronously', function(done) {
		keys(app, function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			done();
		});
	});

	it('returns private keys when the tcid matches the app name', function() {
		expect(keys(app).priv).to.be.ok();
	});

	it('returns nothing when the tcid does not match the app name', function() {
		expect(keys('claims-authority').priv).to.not.be.ok();
	});
});