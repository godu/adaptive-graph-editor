import * as ReactDOM from 'react-dom';
import * as React from 'react';

import Graph from './graph';
import { chapterRule, slides, exitNodes } from './data'

const app = window.document.createElement('div');
window.document.body.appendChild(app);

// tslint:disable-next-line:no-inner-html
ReactDOM.render(
  <Graph chapterRule={chapterRule} slides={Object.values(slides)} exitNodes={Object.values(exitNodes)} />
  , app);

if (module.hot) {
  module.hot.accept(['./graph.tsx', './data.ts'], () => {
    const Graph = require('./graph').default;
    const { chapterRule, slides, exitNodes } = require('./data');
    ReactDOM.render(
      <div>
        <Graph chapterRule={chapterRule} slides={Object.values(slides)} exitNodes={Object.values(exitNodes)} />
      </div>
      , app);
  });
}
