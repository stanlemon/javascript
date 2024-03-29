import * as React from "react";
import { PuttableProps } from "@stanlemon/react-pouchdb";
import { addRow, removeRow, Row, updateRow } from "./DocumentHelpers";

interface Task extends Row {
  id: string;
  name: string;
  completed: boolean;
}

type Props = PuttableProps & {
  tasks: Task[];
};

type State = Omit<Task, "id">;

export class Tasks extends React.Component<Props, State> {
  static defaultProps = {
    tasks: [] as Task[],
    putDocument: (data: Record<string, unknown>) =>
      void (
        {
          // Do nothing
        }
      ),
  };

  state = {
    name: "",
    completed: false,
  };

  updateTask = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      name: e.currentTarget.value,
    });
  };

  addTask = (): void => {
    // If there is no actual note, skip
    if (this.state.name.trim() === "") {
      return;
    }

    this.props.putDocument({
      tasks: addRow(this.props.tasks, {
        name: this.state.name,
        completed: false,
      }),
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
      tasks: removeRow(this.props.tasks, task),
    });
  };

  completeTask = (task: Task): void => {
    this.props.putDocument({
      tasks: updateRow(this.props.tasks, {
        id: task.id,
        completed: !task.completed,
      }),
    });
  };

  render(): React.ReactNode {
    return (
      <>
        <h2 className="is-size-2">Tasks:</h2>
        {this.props.tasks.length === 0 ? (
          <div>
            <em>There are no tasks yet.</em>
          </div>
        ) : (
          <ul>
            {this.props.tasks.map((task, i) => (
              <TaskRow
                key={i}
                task={task}
                completeTask={this.completeTask}
                removeTask={this.removeTask}
              />
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
              onKeyDown={this.addTaskWithEnter}
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
      </>
    );
  }
}

function TaskRow(props: {
  task: Task;
  completeTask: (task: Task) => void;
  removeTask: (task: Task) => void;
}) {
  const { task } = props;
  const completeTask = () => props.completeTask(task);
  const removeTask = () => props.removeTask(task);

  return (
    <li>
      <div className="columns is-mobile">
        <div className="column is-four-fifths">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={completeTask}
            />{" "}
            {task.completed ? <del>{task.name}</del> : task.name}{" "}
          </label>
        </div>
        <div className="column has-text-right">
          <button className="button is-small is-danger" onClick={removeTask}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
