import $ from 'jquery';
import swal from 'sweetalert';

class PageActionsLogicAttacher{

	attachControlCenterSwitchLogic(){
		const controlCenterSwitch = $("#control-center-switch");
		const expandImage = controlCenterSwitch.find("img");
		const controlCenter = $("#control-center");
		const controlCenterWidth = "250px";
		const negControlCenterWidth = '-'+controlCenterWidth;
		let switchState = "closed";

		controlCenter.css("left", negControlCenterWidth);
		controlCenter.width(controlCenterWidth);

		controlCenterSwitch.on('click', () => {
			if(switchState === "closed"){
				expandImage.css("transform", "rotate(180deg)");
				controlCenterSwitch.css("left", controlCenterWidth);
				controlCenter.css("left", "0px");
				switchState = "open";
			} else {
				expandImage.css("transform", "rotate(0deg)");
				controlCenter.css("left", negControlCenterWidth);
				controlCenterSwitch.css("left", "-6px");
				switchState = "closed";
			}
		});
	}

	attachControlBarDragLogic(){
		const controlBar = $("#control-bar");
		const draggable = $(controlBar.find("#drag"));

		let mouseDownOnDraggable = false;
		let startCoords = {};

		controlBar.find("img").each((i, img) => {
			$(img).on("dragstart", () => {
				event.preventDefault();
			});
		});

		draggable.on("mousedown", (event) => {
			mouseDownOnDraggable = true;
			startCoords.x = event.clientX;
			startCoords.y = event.clientY;
		});

		draggable.on("mouseup", () => {
			mouseDownOnDraggable = false;
		});

		document.onmousemove = (event) => {
			if(mouseDownOnDraggable){
				let x = event.clientX;
				let y = event.clientY;
				let delLeft = startCoords.x - x;
				let delTop = startCoords.y - y;

				startCoords = {x, y};
				let curOff = controlBar.offset();
				controlBar.offset({
					left: curOff.left-delLeft,
					top: curOff.top-delTop
				});
			}
		};
	}

	attachAlgorithmOptionsShowHideLogic(){
		const controlCenter = $("#control-center");
		const algorithmSelector = controlCenter.find("#algorithmSelector");

		controlCenter.find(".algorithm-options-section").hide();
		let current = algorithmSelector.val();
		controlCenter.find("#"+current).show();

		algorithmSelector.on("change", (event) => {
			controlCenter.find("#"+current).hide();
			current = event.target.value;
			controlCenter.find("#"+current).show();
		});
	}

	attachDarkModeLogic(){
		let darkModeBtn = $("#control-bar #darkMode"),
			masterStyleElem = $("head #MasterSheet"),
			currentMode = "Light",
			loader = $("#loader");

		darkModeBtn.on("click", () => {
			loader.show();

			if(currentMode === "Light"){
				currentMode = "Dark";
				$.get(`/PathFinding/page/public/css/${currentMode}/Master.css`, css => {
					masterStyleElem.text(css);
				}).done(() => {
					setTimeout(() => loader.hide(), 400);
				});
			} else {
				currentMode = "Light";
				masterStyleElem.text('');
				setTimeout(() => loader.hide(), 100);
			}
		});
	}

	showUsageLink(){
		swal({
			text: "FOR USER MANUAL",
			content: {
				element: "a",
				attributes: {
					"href": "javascript: window.open('https://github.com/Wolverin-e/PathFinding#usage'); swal.close()",
					"text": "GO HERE"
				}
			},
			buttons: {
				CANCEL: true
			}
		});
	}
}

export default new PageActionsLogicAttacher();
