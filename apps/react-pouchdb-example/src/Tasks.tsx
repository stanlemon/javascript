import * as React from "react";
import { PuttableProps } from "./PouchDb";

interface Task {
  name: string;
  completed: boolean;
}

type Props = PuttableProps & {
  tasks?: Task[];
};

type State = Task;

export class Tasks extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    tasks: []
  };

  state = {
    name: "",
    completed: false
  };

  updateTask = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      name: e.currentTarget.value
    });
  };

  addTask = (): void => {
    // If there is no actual note, skip
    if (this.state.name.trim() === "") {
      return;
    }

    this.props.putDocument({
      tasks: [
        ...this.props.tasks,
        {
          name: this.state.name,
          completed: this.state.completed
        }
      ]
    });

    this.setState({ name: "", completed: false });
  };

  addTaskWithEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      this.addTask();
    }
  };

  removeTask = (task: Task): void => {
    this.props.putDocument({
      tasks: this.props.tasks.filter(t => t.name !== task.name)
    });
  };

  completeTask = (task: Task): void => {
    const tasks = this.props.tasks.map(t => {
      if (task.name === t.name) {
        return {
          name: task.name,
          completed: !t.completed
        };
      }
      return t;
    });

    this.props.putDocument({
      tasks
    });
  };

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <h2 className="is-size-2">Tasks:</h2>
        {this.props.tasks.length === 0 ? (
          <div>
            <em>There are no tasks yet.</em>
          </div>
        ) : (
          <ul>
            {this.props.tasks.map((task, i) => (
              <li key={i}>
                <label className="checkbox">
                  {task.completed ? <del>{task.name}</del> : task.name}{" "}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={this.completeTask.bind(this, task)}
                  />
                </label>{" "}
                <button onClick={this.removeTask.bind(this, task)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <br />
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              onChange={this.updateTask}
              onKeyPress={this.addTaskWithEnter}
              value={this.state.name}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" onClick={this.addTask}>
              Add Task
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
