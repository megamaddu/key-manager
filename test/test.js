'use strict';

var opex = require('../')
, expect = require('expect.js')
;

describe('opex:', function () {

	describe('when `opex` is called', function () {
		
		it('returns a new object', function () {	
			var original = {};
			var i = 5000;
			while(--i) {
				expect(original === opex(original)).to.be(false);
			}
		});

		it('supports any number of arguments and overwrites with right-most args\' values', function () {	
			var original = {}
			, v1 = { x: 1 }
			, v2 = { y: 2 }
			, v3 = { z: 3 }
			, v4 = { y: 5 }
			, res = opex(original, v1)
			;
			var i = 1000;
			while(i--) {
				expect(res.x).to.be(1);
				res = opex(original, v1, v2, v3);
				expect(res.x).to.be(1);
				expect(res.y).to.be(2);
				expect(res.z).to.be(3);
				res = opex(res, v4);
				expect(res.y).to.be(5);
			}
		});

		it('ignores non-object and non-function input', function () {
			var original = {}
			, o = { data: 'data' }
			, f = function testFunc() {}
			, i = 42
			;
			f.data = 'asdf';
			var i = 3000;
			while(i--) {
				expect(opex(original, o, f, i).data).to.be('asdf');
			}
		});
	});
});