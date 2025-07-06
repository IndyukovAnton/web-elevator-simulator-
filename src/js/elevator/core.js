import { State } from './modules.js'
import Elevator from './elevator.js'
import ElevatorPanel from './panel.js'

export default class ElevatorCore {
	constructor(startStage = 1) {
		this.elevator = new Elevator()
		this.panel = new ElevatorPanel()
		this.listenerCallTime = 500 // 0.5s
		this.nextStage = null
		this.state = State.STOP
		this.currentStage = startStage > this.elevator.stages.length ? this.elevator.stages.length : startStage
		this.isBusy = false
		this.moveDuration = this.elevator.elevatorSpeed * this.elevator.stageHeight
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
		console.log("Queue start: ", this.panel.queue)


		console.log(this.panel.queue)
		
		if (this.isBusy) { return }

		const indexFirstStageOfQueue = 0
		const targetStage = this.panel.queue[indexFirstStageOfQueue]
		this.isBusy = true

		const resSucces = (isFinished)=> {
			this.currentStage = isFinished.currentStage
			this.panel.updateDisplay(this.currentStage)
		}

		const resError = (err)=> {
			console.error(err)
			moveInterval = clearInterval(moveInterval)
			return
		}

		let moveInterval = setInterval(()=> {
			console.log('MOVING')

			const res = this.elevator.changeStage(targetStage, this.checkVectorMoving(this.currentStage, targetStage))

			res.then(resSucces, resError).then(()=> {
				if (this.elevator.checkStage(this.currentStage, targetStage) && moveInterval) {
					this.panel.queue.splice(indexFirstStageOfQueue, 1)
					moveInterval = clearInterval(moveInterval)
					setTimeout(()=>{
						const currentActiveButton = document.querySelector(`[panel-button="${this.currentStage}"]`)
						currentActiveButton.classList.remove('active')
					}, 500)
					this.isBusy = false
				}
			})

			res.catch(resError)

		}, this.moveDuration)
	}

	init() {
		this.panel.queueMax = this.elevator.stages.length / 2
		this.panel.init()

		this.elevator.init(this.currentStage)

		const listenerCallInterval = setInterval(()=> {
			if (this.panel.queue.length > 0 && !this.isBusy) {
				this.moveToStage()
			}
		}, this.listenerCallTime)
	}
}