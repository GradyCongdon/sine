class StepAction {
  constructor(target, value) {
    this.target = target;
    this.value = value;
  }
}

export class Step {
  constructor(id, actions = []) {
    this.id = id;
    this.actions = actions; // StepAction
  }
  scheduleActions(time) {
    // Schedule each of the actions for a step to occur at the same time
    this.actions.forEach((action) => {
      const target = action.target;
      const value = action.value;
      target.setValueAtTime(value, time); // FIXME PERF hopefully big obj not passed by value
      // const target = synth.keys[target]; lookup via synth
    });
  }
  newAction(target, value) {
    const action = new StepAction(target, value);
    this.addAction(action);
  }
  addAction(action) {
    // TODO Could check for dupes but last val = the final set during scheduling
    this.actions.push(action);
  }
  removeActions() {
    // Would like to do single removal but would need way to track actions
    // NBD for key on / off though, since key could be id to replace
    this.actions = [];
  }
}

