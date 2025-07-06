import { State } from "./modules.js"

export default class Elevator {
	constructor() {
		this.elevator = document?.querySelector('[elevator]')
		this.stages = this.elevator.querySelectorAll('[stage]')
		this.currentStage = null
		this.stageHeight = Math.round(this.stages[0].clientHeight / 10) // 10px/1m
		this.elevatorSpeed = 10 * 10 // 1m / s
	}

	checkStage(currentStage, targetStage) {
		return currentStage === targetStage
	}

	toggleActiveStage(nextStage) {
		this.currentStage.classList.remove('active')
		nextStage.classList.add('active')
	}

	changeStage(targetStage, state = null) {
		const res = new Promise((callback)=>{
			if (this.currentStage === null) { return }
			let nextStageIndex;
			let currentStageIndex = Number(this.currentStage.getAttribute('stage'))

			if (this.checkStage(currentStageIndex, targetStage)) { 
				callback({'status': true, 'currentStage': currentStageIndex})
				return 
			}

			switch (state) {
				case State.UP:
					nextStageIndex = currentStageIndex + 1
					break
				case State.DOWN:
					nextStageIndex = currentStageIndex - 1
					break
			}

			let nextStage = this.elevator.querySelector(`[stage="${nextStageIndex}"]`)

			this.toggleActiveStage(nextStage)
			this.currentStage = nextStage
			
			currentStageIndex = Number(this.currentStage.getAttribute('stage'))

			callback({'status': true, 'currentStage': currentStageIndex})
		})
		
		return res
	}

	init(stage = null) {
		if (stage === null) { return }

		this.currentStage = this.elevator.querySelector(`[stage="${stage}"]`)
		this.currentStage.classList.add('active')
	}
}