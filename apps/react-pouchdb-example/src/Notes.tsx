import * as React from "react";
import { PuttableProps } from "./PouchDb";

type Props = PuttableProps & {
  notes?: string[];
};

interface State {
  note: string;
}

export class Notes extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    notes: []
  };

  state = {
    note: ""
  };

  updateNote = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      note: e.currentTarget.value
    });
  };

  addNote = (): void => {
    // If there is no actual note, skip
    if (this.state.note.trim() === "") {
      return;
    }

    this.props.putDocument({
      notes: [...this.props.notes, this.state.note]
    });

    this.setState({ note: "" });
  };

  addNoteWithEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      this.addNote();
    }
  };

  removeNote(note: string): void {
    this.props.putDocument({
      notes: this.props.notes.filter(n => n !== note)
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <ul>
          {this.props.notes.map((note, i) => (
            <li key={i}>
              {note}
              <button onClick={this.removeNote.bind(this, note)}>Remove</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          onChange={this.updateNote}
          onKeyPress={this.addNoteWithEnter}
          value={this.state.note}
        />
        <button onClick={this.addNote}>Add</button>
      </div>
    );
  }
}
