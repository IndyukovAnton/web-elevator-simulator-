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
				button.classList.add('active')
				const stageId = Number(button.getAttribute('panel-button'))
				this.addToQueue(stageId)
			}
		});
	}

	addToQueue(stage) {
		if (this.queue.length == this.queueMax) { return }

		if (!this.queue.includes(stage)) {
			this.queue.push(stage)
		}
	}

	updateDisplay(stageNumber = null, direction) {
		if (stageNumber === null) { return }

		this.display.querySelector('.stage-number').textContent = stageNumber
		this.display.querySelector('.direction').textContent = direction.symbol
	}
}