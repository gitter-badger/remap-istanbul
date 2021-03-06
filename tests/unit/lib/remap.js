define([
	'intern!object',
	'intern/chai!assert',
	'../../../lib/node!istanbul/lib/collector',
	'../../../lib/loadCoverage',
	'../../../lib/remap'
], function (registerSuite, assert, Collector, loadCoverage, remap) {
	registerSuite({
		name: 'remap-istanbul/lib/remap',

		'remapping': function () {
			var coverage = remap(loadCoverage('tests/unit/support/coverage.json'));
			assert.instanceOf(coverage, Collector, 'Return values should be instance of Collector');
			assert(coverage.store.map['tests/unit/support/basic.ts'],
				'The Collector should have a remapped key');
			assert.strictEqual(Object.keys(coverage.store.map).length, 1,
				'Collector should only have one map');
			var map = JSON.parse(coverage.store.map['tests/unit/support/basic.ts']);
			assert.strictEqual(map.path, 'tests/unit/support/basic.ts');
			assert.strictEqual(Object.keys(map.statementMap).length, 28, 'Map should have 28 statements');
			assert.strictEqual(Object.keys(map.fnMap).length, 6, 'Map should have 6 functions');
			assert.strictEqual(Object.keys(map.branchMap).length, 6, 'Map should have 6 branches');
		},

		'base64 source map': function () {
			var coverage = remap(loadCoverage('tests/unit/support/inline-coverage.json'));
			assert.instanceOf(coverage, Collector, 'Return values should be instance of Collector');
			assert(coverage.store.map['tests/unit/support/basic.ts'],
				'The Collector should have a remapped key');
			assert.strictEqual(Object.keys(coverage.store.map).length, 1,
				'Collector should only have one map');
			var map = JSON.parse(coverage.store.map['tests/unit/support/basic.ts']);
			assert.strictEqual(map.path, 'tests/unit/support/basic.ts');
			assert.strictEqual(Object.keys(map.statementMap).length, 28, 'Map should have 28 statements');
			assert.strictEqual(Object.keys(map.fnMap).length, 6, 'Map should have 6 functions');
			assert.strictEqual(Object.keys(map.branchMap).length, 6, 'Map should have 6 branches');
		},

		'empty options': function () {
			assert.throws(remap, TypeError);
		},

		'basePath' : function() {
			var coverage = remap(loadCoverage('tests/unit/support/coverage.json'), {
				basePath : 'foo/bar'
			});

			assert(coverage.store.map['foo/bar/basic.ts'],  'The base path provided should have been used');
			assert.strictEqual(Object.keys(coverage.store.map).length, 1,
				'Collector should only have one map');
			var map = JSON.parse(coverage.store.map['foo/bar/basic.ts']);
			assert.strictEqual(map.path, 'foo/bar/basic.ts', 'The base path should be used in the map as well');
		},

		'missing coverage source': function () {
			var warnStack = [];
			function warn() {
				warnStack.push(arguments);
			}
			remap(loadCoverage('tests/unit/support/badcoverage.json'), {
				warn: warn
			});
			assert.strictEqual(warnStack.length, 2, 'warn should have been called twice');
			assert.instanceOf(warnStack[0][0], Error, 'should have been called with error');
			assert.strictEqual(warnStack[0][0].message, 'Could not find file: "tests/unit/support/bad.js"',
				'proper error message should have been returend');
			assert.instanceOf(warnStack[1][0], Error, 'should have been called with error');
			assert.strictEqual(warnStack[1][0].message, 'Could not find source map for: "tests/unit/support/bad.js"',
				'proper error message should have been returend');
		},

		'missing source map': function () {
			var coverage = loadCoverage('tests/unit/support/missingmapcoverage.json');
			assert.throws(function () {
				remap(coverage);
			}, Error);
		},

		'unicode in map': function () {
			var coverage = remap(loadCoverage('tests/unit/support/coverage-unicode.json'));

			assert(coverage.store.map['tests/unit/support/unicode.ts'], 'The file should have been properly mapped.');
			assert.strictEqual(Object.keys(coverage.store.map).length, 1,
				'Collector should have only one map.');
		}
	});
});
