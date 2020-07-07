// var visualize = require('javascript-state-machine/lib/visualize');
// var StateMachine = require('javascript-state-machine');

const stateMachineData = {
	init: 'steady', 
	transitions: [
		{
			name: 'initialize', 
			from: 'steady', 
			to: 'Rendering'
		}, 
		{
			name: 'edit', 
			from: 'Rendering', 
			to: 'Editing'
		}, 
		{
			name: 'startAddingWalls', 
			from: 'Editing', 
			to: 'AddingWalls'
		}, 
		{
			name: 'startShiftingEndPoint', 
			from: 'Editing', 
			to: 'ShiftingEndPoint'
		}, 
		{
			name: 'startRemovingWalls', 
			from: 'Editing', 
			to: 'RemovingWalls'
		}, 
		{
			name: 'startShiftingStartPoint', 
			from: 'Editing', 
			to: 'ShiftingStartPoint'
		}, 
		{
			name: 'goBackToEditing', 
			from: ['AddingWalls', 'RemovingWalls', 'ShiftingStartPoint', 'ShiftingEndPoint'], 
			to: 'Editing'
		}, 
		{
			name: 'compute', 
			from: 'Editing', 
			to: 'Computing'
		}, 
		{
			name: 'play', 
			from: 'Computing', 
			to: 'Playing'
		}, 
		{
			name: 'pause', 
			from: ['Playing', 'Finished'], 
			to: 'Paused'
		}, 
		{
			name: 'resume', 
			from: 'Paused', 
			to: 'Playing'
		}, 
		{
			name: 'finish', 
			from: ['Paused'], 
			to: 'Finished'
		}, 
		{
			name: 'restart', 
			from: ['Finished', 'Paused', 'pathCleared'], 
			to: 'Playing'
		}, 
		{
			name: 'clearPath', 
			from: ['Paused', 'Finished'], 
			to: 'pathCleared'
		},
		{
			name: 'gridEdit', 
			from: ['Finished', 'Paused', 'pathCleared'], 
			to: 'Editing'
		}
	]
};

// const sm = new StateMachine(stateMachineData);
// console.log(visualize(sm));

export default stateMachineData;
