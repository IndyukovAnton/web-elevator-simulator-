import { State } from './modules.js'

export default function initElevator() {
	const elevator = new Elevator()
	const panel = new ElevatorPanel(elevator)
}

class Elevator {
	constructor() {
		this.elevator = document?.querySelector('[elevator]')
		this.stages = this.elevator.querySelectorAll('[stage]')
		this.currentStage = null
		this.stageHeight = Math.round(this.stages[0].clientHeight / 10) // 10px/1m
		this.elevatorSpeed = 10 * 10 // 1m / s
	}

	checkStage(stage, stageIndex) {
		return Number(stage.getAttribute('stage')) === stageIndex
	}

	changeStage(stage) {

		const res = new Promise((callback)=>{
			let moveDuration = this.elevatorSpeed * this.stageHeight

			const moveInterval = setInterval(()=> {
				if (this.currentStage !== null) {
					this.currentStage.classList.remove('active')
				}

				let nextStage = this.elevator.querySelector(`[stage="${stage}"]`)
				
				nextStage.classList.add('active')
				this.currentStage = nextStage

				callback(true)
				clearInterval(moveInterval)
			}, moveDuration)
		})

		return res
	}
}

class ElevatorPanel {
	constructor(elevator, startStage = 20) {
		this.elevator = elevator
		this.display = document?.querySelector('[panel-display]')
		this.buttons = document?.querySelectorAll('[panel-button]')
		this.queue = []
		this.nextStage = null
		this.state = State.STOP
		this.queueMax = this.elevator.stages.length / 2
		this.currentStage = startStage > this.elevator.stages.length ? this.elevator.stages.length : startStage
		this.isBusy = false

		if (this.buttons) {
			this.init()
		}
	}

	addToQueue(stage) {
		if (this.queue.length == this.queueMax) { return }

		if (stage in this.queue) { return }

		this.queue.push(stage)
	}

	checkVectorMoving(current, next) {
		if (current > next) {
			return State.DOWN
		} else if (current < next) {
			return State.UP
		} else {
			return State.STOP
		}
	}

	moveToStage() {
		
		if (this.isBusy) { return }

		const res = this.elevator.changeStage(this.queue[0])
		this.isBusy = true

		res.then((isFinished)=> {
			this.currentStage = this.queue[0]
			this.queue.splice(0, 1)
			this.isBusy = !isFinished
			this.updateDisplay()
		}, null)
		
		res.catch((err)=> {
			console.log(err)
		})

		
	}

	setListenerCall() {
		let intervalListener = setInterval(()=> {
			if (this.queue.length != 0) {
				this.moveToStage()
			}
		}, 500)
	}

	bindButtons() {
		this.buttons.forEach(button => {
			button.onclick = ()=> {
				const stageId = button.getAttribute('panel-button')
				
				this.addToQueue(stageId) 
			}
		});
	}

	updateDisplay() {
		this.display.querySelector('span').textContent = this.currentStage
	}

	init() {
		this.elevator.changeStage(this.currentStage)
		this.updateDisplay()
		this.bindButtons()
		this.setListenerCall()
	}
}