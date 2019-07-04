import * as React from "react";
import { PuttableProps } from "@stanlemon/react-pouchdb";
import { Form } from "@stanlemon/react-form";
import { addRow, updatePartialRow, removeRow } from "./DocumentHelpers";

interface Task {
  id: string;
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

  addTask = (values: { name: string }): {} => {
    this.props.putDocument({
      tasks: addRow(this.props.tasks, {
        ...values,
        completed: false
      })
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
      tasks: removeRow(this.props.tasks, task)
    });
  };

  completeTask = (task: Task): void => {
    this.props.putDocument({
      tasks: updatePartialRow(this.props.tasks, task.id {
        completed: !task.completed
      })
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
        <Form ref={this.formRef} onSuccess={this.addTask}>
          <div className="field">
            <div className="control">
              <input
                name="name"
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
