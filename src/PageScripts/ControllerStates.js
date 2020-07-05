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
		}
	]
};

export default stateMachineData;
