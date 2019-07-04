import * as React from "react";
import { PuttableProps } from "@stanlemon/react-pouchdb";
import { Form } from "@stanlemon/react-form";

interface Note {
  note: string;
}

type Props = PuttableProps & {
  notes?: Note[];
};

interface State {
  note: string;
}

export class Notes extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    notes: []
  };

  addNote = (values: Note): {} => {
    this.props.putDocument({
      notes: [...this.props.notes, { note: values.note }]
    });
    return {};
  };

  removeNote = (note: Note): void => {
    this.props.putDocument({
      notes: this.props.notes.filter(n => n.note !== note.note)
    });
  };

  render(): React.ReactNode {
    return (
      <>
        <h2 className="is-size-2">Notes:</h2>
        <ul>
          {this.props.notes.map((note, i) => (
            <NoteRow key={i} note={note} removeNote={this.removeNote} />
          ))}
        </ul>
        <br />
        <Form onSuccess={this.addNote}>
          <div className="field">
            <div className="control">
              <textarea name="note" className="textarea" />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary">Add Note</button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

function NoteRow(props: { note: Note; removeNote(note: Note): void }) {
  const removeNote = () => props.removeNote(props.note);

  return (
    <li>
      <div className="columns is-mobile">
        <div className="column is-four-fifths">{props.note.note}</div>
        <div className="column has-text-right">
          <button className="button is-small is-danger" onClick={removeNote}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
