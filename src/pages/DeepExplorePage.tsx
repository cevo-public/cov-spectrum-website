import { Country } from '../services/api-types';
import { DateRange, SamplingStrategy } from '../services/api';
import { DeepRoute, makeLayout, makeSwitch } from '../helpers/deep-page';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';
import { Route, useRouteMatch } from 'react-router';
import { SequencingCoverageDeepExplore } from '../components/SequencingCoverageDeepExplore';
import { SequencingIntensityEntrySetWithSelector } from '../helpers/sequencing-intensity-entry-set';

interface Props {
  country: Country;
  dateRange: DateRange;
  samplingStrategy: SamplingStrategy;
  sequencingIntensityEntrySet: SequencingIntensityEntrySetWithSelector;
}

const routes: DeepRoute<Props>[] = [
  {
    key: 'sequencing-coverage',
    title: 'Sequencing Coverage',
    content: props => (
      <SequencingCoverageDeepExplore
        country={props.country}
        dateRange={props.dateRange}
        samplingStrategy={props.samplingStrategy}
        sequencingIntensityEntrySet={props.sequencingIntensityEntrySet}
      />
    ),
  },
];

export const DeepExplorePage = (props: Props) => {
  const { path, url } = useRouteMatch();
  const _makeLayout = (content: JSX.Element) =>
    makeLayout(
      <div className='ml-3'>
        <div className='flex'>
          <h1 style={{ flexGrow: 1 }}>
            {routes.map(route => (
              <Route key={route.key} path={`${path}/${route.key}`}>
                {route.title}
              </Route>
            ))}
          </h1>
          <div>
            <Button className='mt-2' variant='secondary' as={Link} to={url}>
              Back to overview
            </Button>
          </div>
        </div>
      </div>,
      content
    );
  return _makeLayout(makeSwitch(routes, props, path));
};
