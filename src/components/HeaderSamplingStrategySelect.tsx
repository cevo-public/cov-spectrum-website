import React from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayTriggerRenderProps } from 'react-bootstrap/esm/OverlayTrigger';
import { useExploreUrl } from '../helpers/explore-url';
import { SamplingStrategy } from '../services/api';

export const HeaderSamplingStrategySelect = () => {
  const exploreUrl = useExploreUrl();

  if (!exploreUrl) {
    return null;
  }

  const locked = exploreUrl.country !== 'Switzerland';

  const makeForm = ({ ref, ...props }: Partial<OverlayTriggerRenderProps>) => (
    <Form inline className='mr-3'>
      <div {...props} ref={ref}>
        <Form.Control
          as='select'
          custom
          id='samplingStrategySelect'
          value={exploreUrl.samplingStrategy}
          onChange={ev => exploreUrl.setSamplingStrategy(ev.target.value as SamplingStrategy)}
          disabled={!!locked}
          style={locked ? { pointerEvents: 'none' } : undefined}
        >
          <option value={SamplingStrategy.AllSamples}>All samples</option>
          <option value={SamplingStrategy.Surveillance}>Surveillance</option>
        </Form.Control>
      </div>
    </Form>
  );

  const tooltip = (
    <Tooltip id='samplingStrategyDisabledTooltip'>
      Filtering for surveillance samples is only supported for Switzerland.
    </Tooltip>
  );

  return locked ? (
    <OverlayTrigger placement='bottom' overlay={tooltip}>
      {makeForm}
    </OverlayTrigger>
  ) : (
    makeForm({})
  );
};
