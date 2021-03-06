import * as React               from 'react';
import * as ReactDOM            from 'react-dom';

import App                      from 'src/App';
import recipesStore             from 'stores/recipes';
import notificationsStore       from 'stores/notifications';

import { AppContainer }         from 'react-hot-loader';
import { RouterStore,
         syncHistoryWithStore } from 'mobx-react-router';
import { Provider }             from 'mobx-react';
import { BrowserRouter,
         Route }                from 'react-router-dom';
import { enableLogging }        from 'mobx-logger';
import { configure }            from 'mobx';

import './styles/style.scss';

configure({ enforceActions: true });

const routingStore = new RouterStore();

ReactDOM.render(
  <AppContainer>
    <Provider
      notificationsStore={notificationsStore}
      recipesStore={recipesStore}
      routing={routingStore}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root'),
);

enableLogging({
  action: true,
  reaction: true,
  transaction: true,
  compute: true,
});

