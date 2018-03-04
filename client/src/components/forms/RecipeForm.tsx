import * as React      from 'react';

import Button          from 'components/Button';
import Input           from 'components/forms/common/Input';
import FileInput       from 'components/forms/common/FileInput';
import RatingPicker    from 'components/RatingPicker';
import Select          from 'components/forms/common/Select';
import TagInput        from 'components/forms/common/TagInput';
import Textarea        from 'components/forms/common/Textarea';

import { RATING_LIST } from 'constants/general';
import { getClass }    from 'utils/getClass';
import { action,
         observable,
         toJS  }       from 'mobx';
import { observer,
         inject }      from 'mobx-react';
import { recipeFromForm,
         recipeFromDb,
         recipesStore,
         ingredient }  from 'stores/recipes';

interface RecipeFormProps {
  recipe?: recipeFromDb;
  recipesStore?: recipesStore;
  type?: string;
}

interface AddRecipeFormState {
  data: recipeFromForm;
}

@inject('recipesStore')
@observer
class RecipeForm extends React.Component<RecipeFormProps> {
  static defaultProps = {
    type: 'add',
  };

  @observable data = {
    description: this.getInitData('description'),
    ingredients: this.getInitData('ingredients'),
    name: this.getInitData('name'),
    rating: this.getInitData('rating'),
    tags: this.getInitData('tags'),
  };

  getInitData(name: string) {
    const defaultValues = {
      description: '',
      ingredients: [],
      name: '',
      rating: 0,
      tags: [],
    };

    return (this.props.recipe) ? this.props.recipe[name] : defaultValues[name];
  }

  handleSubmit = (e) => {
    const {
      recipesStore: {
        addRecipe,
      },
    } = this.props;

    e.preventDefault();
    addRecipe(this.data);
  }

  @action.bound
  handleFormDataChange(name: string, value: string|number|File|{ [key: string]: string }[]) {
    // specific handling requires, because TagInput returns an array of objects for each input
    if (name === 'tags' && value instanceof Array) {
      this.data[name] = value.map(item => item[name]);
    } else if (name === 'ingredients' && value instanceof Array) {
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
    const {
      recipesStore: { isSendingRequest },
      type,
    } = this.props;

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
              value={this.data.name}
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
              value={this.data.description}
            />

            <RatingPicker
              ratingList={RATING_LIST}
              label="Rating"
              onChange={this.handleFormDataChange}
              value={this.data.rating}
            />

            <FileInput
              id="photo"
              label="Photo"
              name="photo"
              onChange={this.handleFormDataChange}
            />

            <Button
              icon="send"
              isLoading={isSendingRequest}
              onClick={this.handleSubmit}
              text={(type === 'add') ? 'Submit' : 'Save'}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default RecipeForm;
