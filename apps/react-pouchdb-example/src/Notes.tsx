import * as React from "react";
import { PuttableProps } from "./PouchDb";

type Props = PuttableProps & {
  notes?: { note: string }[];
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

  updateNote = (e: React.FormEvent<HTMLTextAreaElement>): void => {
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
      notes: [...this.props.notes, { note: this.state.note }]
    });

    this.setState({ note: "" });
  };

  addNoteWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addNote();
    }
  };

  removeNote(note: { note: string }): void {
    this.props.putDocument({
      notes: this.props.notes.filter(n => n.note !== note.note)
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <h2>Notes:</h2>
        <ul>
          {this.props.notes.map((note, i) => (
            <li key={i}>
              {note.note}
              <button onClick={this.removeNote.bind(this, note)}>Remove</button>
            </li>
          ))}
        </ul>
        <textarea
          onChange={this.updateNote}
          onKeyPress={this.addNoteWithEnter}
          value={this.state.note}
        />
        <div>
          <button onClick={this.addNote}>Add Note</button>
        </div>
      </div>
    );
  }
}
