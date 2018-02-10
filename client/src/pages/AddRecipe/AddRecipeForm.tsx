import * as React           from 'react';

import Button               from 'components/Button';
import Input                from 'components/forms/Input';
import RatingPicker         from 'components/RatingPicker';
import Select               from 'components/forms/Select';
import TagInput             from 'components/forms/TagInput';
import Textarea             from 'components/forms/Textarea';

import { RATING_LIST }      from 'constants/general';
import { getClass }         from 'utils/getClass';
import { action,
         observable,
         useStrict,
         toJS  }            from 'mobx';
import { observer, inject } from 'mobx-react';

interface AddRecipeFormProps {
  // onSubmit: (data: data) => any;
  addRecipeStore?: {
    addRecipe: (data: data) => any;
    isSendingRequest: boolean;
  };
}

interface AddRecipeFormState {
  data;
}

interface data {
  description: string;
  ingredients: ingredient[];
  name: string;
  rating: number;
  tags: string[];
}

interface ingredient {
  amount: string;
  name: string;
}

@inject('addRecipeStore')
@observer
class AddRecipeForm extends React.Component<AddRecipeFormProps> {
  @observable data = {
    description: '',
    ingredients: [],
    name: '',
    rating: 0,
    tags: [],
  };

  handleSubmit = (e) => {
    const {
      addRecipeStore: {
        addRecipe,
      },
    } = this.props;

    e.preventDefault();
    addRecipe(toJS(this.data));
  }

  @action.bound
  handleFormDataChange(name: string, value: string|number|{ [key: string]: string }[]) {
    // specific handling requires, because TagInput returns an array of objects for each input
    if (name === 'tags' && typeof value === 'object') {
      this.data[name] = value.map(item => item[name]);
    } else if (name === 'ingredients' && typeof value === 'object') {
      // replace keys for objects from 'ingredients[key]' to 'key'
      // ingredients[key] - this format used, because key can duplicate name with real inputs
      this.data[name] = value.map((item) => {
        const itemKeys = Object.keys(item);

        return itemKeys.reduce(
          (result, key) => ({ ...result, [key.match(/ingredients\[(.*)\]/)[1]]: item[key] }),
          {});
      });
    } else {
      this.data[name] = value;
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col g--6">
          <form onSubmit={this.handleSubmit}>
            <Input
              autofocus
              id="name"
              label="Name"
              name="name"
              onChange={this.handleFormDataChange}
            />

            <TagInput
              btn="Add ingredient"
              label="Ingredients"
              name="ingredients"
              inputs={[{
                id: 'ingredients[name]',
                label: 'Name',
                name: 'ingredients[name]',
              }, {
                id: 'ingredients[amount]',
                label: 'Amount',
                name: 'ingredients[amount]',
              }]}
              onTagsUpdate={this.handleFormDataChange}
            />

            <TagInput
              btn="Add tag"
              label="Tags"
              name="tags"
              inputs={[{
                id: 'tags',
                name: 'tags',
              }]}
              onTagsUpdate={this.handleFormDataChange}
            />

            <Textarea
              id="description"
              name="description"
              label="Description"
              onChange={this.handleFormDataChange}
            />

            <RatingPicker
              ratingList={RATING_LIST}
              label="Rating"
              onChange={this.handleFormDataChange}
            />

            <Button
              text="Submit"
              icon="send"
              onClick={this.handleSubmit}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default AddRecipeForm;
