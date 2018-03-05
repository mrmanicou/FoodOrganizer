import * as React from 'react';

import { getClass } from 'utils/getClass';

interface RatingPickerProps {
  ratingList: number[];
  name?: string;
  label?: string;
  modifiers?: string;
  onChange?: (name: string, rating: number) => any;
  value?: number;
}

interface RatingPickerState {
  rating: number;
}

class RatingPicker extends React.Component<RatingPickerProps> {
  static defaultProps = {
    modifiers: '',
    name: 'rating',
    number: 0,
  };

  state = {
    rating: this.props.value,
  };

  handleRatingChange = (e, num) => {
    const { rating } = this.state;
    const { onChange, name } = this.props;
    const newRating = (e.target.checked || rating !== num) ? num : 0;

    this.setState({ rating: newRating });

    if (onChange) {
      onChange(name, num);
    }
  }

  render() {
    const { rating } = this.state;
    const {
      ratingList,
      label,
      modifiers,
      name,
    } = this.props;

    return (
      <div className={getClass('rating-picker', modifiers)}>
        { (label)
          ? (<p className="rating-picker__label">
            { label }
          </p>)
          : null }

        { ratingList.map((num) => {
          const handleClick = e => this.handleRatingChange(e, num);

          return (
            <React.Fragment key={num}>
              <input
                id={`${name}-${num}`}
                className="rating-picker__input"
                type="checkbox"
                name={name}
                checked={num <= rating}
                onChange={handleClick}
              />

              <label
                htmlFor={`${name}-${num}`}
                className="rating-picker__input-label"
              >
                { num }
              </label>
            </React.Fragment>
          );
        }) }
      </div>
    );
  }
}

export default RatingPicker;
