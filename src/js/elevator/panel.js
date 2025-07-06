export default class ElevatorPanel {
	constructor() {
		this.display = document?.querySelector('[panel-display]')
		this.buttons = document?.querySelectorAll('[panel-button]')
		this.queueMax = null
		this.queue = []
	}

	init() {
		if (this.buttons) {
			this.bindButtons()
		}
	}

	bindButtons() {
		this.buttons.forEach(button => {
			button.onclick = ()=> {
				const stageId = Number(button.getAttribute('panel-button'))
				this.addToQueue(stageId) 
			}
		});
	}

	addToQueue(stage) {
		if (this.queue.length == this.queueMax) { return }

		if (stage in this.queue) { return }

		this.queue.push(stage)
	}

	updateDisplay(stageNumber = null) {
		if (stageNumber === null) { return }

		this.display.querySelector('span').textContent = stageNumber
	}
}