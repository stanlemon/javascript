import * as React from "react";
import { PuttableProps } from "@stanlemon/react-pouchdb";
import { Form } from "@stanlemon/react-form";

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

  private formRef: React.RefObject<Form>;

  constructor(props: Props) {
    super(props);
    this.formRef = React.createRef();
  }

  addTask = (values: { task: string }): {} => {
    this.props.putDocument({
      tasks: [
        ...this.props.tasks,
        {
          name: values.task,
          completed: false
        }
      ]
    });

    // Clear out the form
    return {};
  };

  addTaskWithEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.formRef.current.submit();
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
      <>
        <h2 className="is-size-2">Tasks:</h2>
        {this.props.tasks.length === 0 ? (
          <div>
            <em>There are no tasks yet.</em>
          </div>
        ) : (
          <ul>
            {this.props.tasks.map((task, i) => (
              <li key={i}>
                <div className="columns is-mobile">
                  <div className="column is-four-fifths">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={this.completeTask.bind(this, task)}
                      />{" "}
                      {task.completed ? <del>{task.name}</del> : task.name}{" "}
                    </label>
                  </div>
                  <div className="column has-text-right">
                    <button
                      className="button is-small is-danger"
                      onClick={this.removeTask.bind(this, task)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <br />
        <Form ref={this.formRef} onSuccess={this.addTask}>
          <div className="field">
            <div className="control">
              <input
                name="task"
                className="input"
                type="text"
                onKeyPress={this.addTaskWithEnter}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary">Add Task</button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}
