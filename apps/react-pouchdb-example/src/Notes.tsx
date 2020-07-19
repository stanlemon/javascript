import * as React from "react";
import { Row } from "./DocumentHelpers";
import { RowProps } from "./DocumentWithRows";
import { MultilineText } from "./MultilineText";

type Note = Row & {
  id: string;
  note: string;
};

type Props = RowProps & {
  notes: Note[];
};

type State = {
  note: string;
};

export class Notes extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    notes: [],
  };

  state = {
    note: "",
  };

  updateNote = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    this.setState({
      note: e.currentTarget.value,
    });
  };

  addNote = (): void => {
    // If there is no actual note, skip
    if (this.state.note.trim() === "") {
      return;
    }

    this.props.addRow({ note: this.state.note });

    this.setState({ note: "" });
  };

  addNoteWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addNote();
    }
  };

  removeNote(note: Note): void {
    this.props.removeRow(note);
  }

  render(): React.ReactNode {
    return (
      <div>
        <h2 className="is-size-2">Notes:</h2>
        <ul>
          {this.props.notes.map((note, i) => (
            <li key={i}>
              <div className="columns is-mobile">
                <div className="column is-four-fifths content">
                  <MultilineText text={note.note} />
                </div>
                <div className="column has-text-right">
                  <button
                    className="button is-small is-danger"
                    onClick={this.removeNote.bind(this, note)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="is-size-3">New Note:</h3>
        <div className="field">
          <div className="control">
            <textarea
              className="textarea"
              onChange={this.updateNote}
              onKeyPress={this.addNoteWithEnter}
              value={this.state.note}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" onClick={this.addNote}>
              Add Note
            </button>
          </div>
        </div>
      </div>
    );
  }
}
