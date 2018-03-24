import * as React                  from 'react';

import Button                      from 'components/Button';
import Container                   from 'components/layout/Container';
import Loader                      from 'components/Loader';
import Pagination                  from 'components/pagination';
import RecipeItem                  from './RecipeItem';
import Title                       from 'components/typography/Title';
import RecipesFilter               from './RecipesFilter';

import { DEFAULT_ITEMS_PER_PAGE,
         START_PAGE              } from 'constants/pagination';
import { getPaginationIndexes }    from 'utils/pagination';
import { inject,
         observer }                from 'mobx-react';
import { recipesStore }            from 'stores/recipes';
import { action,
         toJS,
         observable }              from 'mobx';

interface RecipeListProps {
  recipesStore?: recipesStore;
}

@inject('recipesStore')
@observer
class RecipeList extends React.Component<RecipeListProps> {
  @observable currentPage = START_PAGE;
  @observable filterIsActive = false;

  componentDidMount() {
    const {
      recipesStore: {
        getRecipes,
      },
    } = this.props;

    getRecipes();
  }

  @action.bound
  onPageChange(page: number) {
    this.currentPage = page;

    window.scrollTo(0, 0);
  }

  @action.bound
  toggleFilter() {
    this.filterIsActive = !this.filterIsActive;
  }

  render() {
    const {
      recipesStore: {
        isSendingRequest,
        filtredRecipes,
      },
    } = this.props;
    const {
      maxIndex,
      minIndex,
    } = getPaginationIndexes({ currentPage: this.currentPage });

    return (
      <React.Fragment>
        <Container>
          <Title
            text="Recipe list"
            modifiers="inline-block"
          />

          <Button
            icon={(this.filterIsActive) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            modifiers="right raised mt10"
            onClick={this.toggleFilter}
            text={(this.filterIsActive) ? 'Hide filter' : 'Show filter'}
          />
        </Container>

        { (this.filterIsActive)
          ? <RecipesFilter />
          : null }

        <div className="recipe-list__list">
          { filtredRecipes.slice(minIndex, maxIndex).map(recipe => (
            <RecipeItem
              key={recipe._id}
              recipe={recipe}
            />
          )) }
        </div>

        <Pagination
          pagesCount={Math.ceil(filtredRecipes.length / DEFAULT_ITEMS_PER_PAGE)}
          currentPage={this.currentPage}
          onPageChange={this.onPageChange}
        />
        <Loader isActive={isSendingRequest} />
      </React.Fragment>
    );
  }
}

export default RecipeList;
