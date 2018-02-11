import * as React   from 'react';

import * as cx      from 'classnames';

import { getClass } from 'utils/getClass';

interface TextareaProps {
  id: string;
  label?: string;
  labelModifiers?: string;
  name: string;
  onChange?: (name: string, value: string) => void;
  rows?: number;
}

class Textarea extends React.Component<TextareaProps> {
  static defaultProps = {
    labelModifiers: '',
    rows: 5,
  };

  state = {
    focused: false,
  };

  handleFocus = (e) => {
    this.setState({ focused: e.type === 'focus' });
  }

  handleChange = (e) => {
    const {
      name,
      onChange,
    } = this.props;

    onChange(name, e.target.value);
  }


  render() {
    const { focused } = this.state;
    const {
      label,
      labelModifiers,
      id,
      name,
      rows,
    } = this.props;

    return (
      <div className={getClass('textarea', cx({ active: focused }))}>
        <textarea
          className="textarea__tag"
          id={id}
          name={name}
          onChange={this.handleChange}
          rows={rows}
          onFocus={this.handleFocus}
          onBlur={this.handleFocus}
        />

        { (label)
          ? (<label
            htmlFor={id}
            className={getClass('textarea__label', labelModifiers)}
          >
            { label }
          </label>)
          : null }
      </div>
    );
  }
}

export default Textarea;