/* global describe, it */
var assert = require("assert"),
	state = require("../lib/state.com.js");
var nextRand = [];

// this test overrides the default implementation of the random selector for choices as we're not looking to test the randomness of hte numbers, but the application of them to choose different transtiions therefore we need to turn the non-deterministic into something deterministic
function randRobin(max) {
	var result = nextRand[max] || 0;
	
	if((nextRand[max] = result + 1) === max) {
		nextRand[max] = 0;
	}
	
	return  result;
}

var model = new state.StateMachine("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model).exit(function (message, instance) {instance.calls += 1;} );
var stateB = new state.State("stateB", model).entry(function (message, instance) {instance.calls += 2;});
var choice = new state.PseudoState("choice", model, state.PseudoStateKind.Choice);

initial.to(stateA);

stateA.to(choice).when(function(message) { return message === "choose"; });
stateA.to(stateB).else();

choice.to(stateA).effect(function (message, instance) { instance.path1++; })
choice.to(stateA).effect(function (message, instance) { instance.path2++; })
choice.to(stateA).effect(function (message, instance) { instance.path3++; })

describe("test/choice.js", function () {
	describe("With an random distribution, we process all messages (and test the true random nature)", function () {
		var instance1 = new state.StateMachineInstance("instance1");
		instance1.path1 = 0;
		instance1.path2 = 0;
		instance1.path3 = 0;
		
		state.initialise(model, instance1);
		
		for (var i = 0; i < 99; i++) {
			state.evaluate(model, instance1, "choose");
		}
		
		state.evaluate(model, instance1, "end");

		it("choice pseudo state transitions all selected randomly", function () {			
			assert.equal(99, instance1.path1 + instance1.path2 + instance1.path3);			
		});
	});
	
	describe("With an non-random distribution, each path is called equally", function () {
		state.setRandom(randRobin);
		
		var instance2 = new state.StateMachineInstance("instance2");
		instance2.path1 = 0;
		instance2.path2 = 0;
		instance2.path3 = 0;
		
		state.initialise(model, instance2);
		
		for (var i = 0; i < 99; i++) {
			state.evaluate(model, instance2, "choose");
		}
		
		state.evaluate(model, instance2, "end");

		it("choice pseudo state transition selection alignmed to random function used", function () {			
			assert.equal(33, instance2.path1);
			assert.equal(33, instance2.path2);
			assert.equal(33, instance2.path3);
		});
	});	
});