import React, { useEffect, useState } from 'react';
import { Place, Variant } from '../services/api-types';
import { PangolinLineageAliasResolverService } from '../services/PangolinLineageAliasResolverService';
import { getWHOLabel, getWHOVariantType } from '../services/who-label';
import { formatVariantDisplayName, isPurePangolinLineage } from '../helpers/variant-selector';

export interface Props {
  variant: Variant;
  titleSuffix?: React.ReactChild | React.ReactChild[];
  controls?: React.ReactChild | React.ReactChild[];
  place: Place;
}

export const VariantHeader = ({ variant, titleSuffix, controls }: Props) => {
  const [resolvedFullName, setResolvedFullName] = useState<string | undefined>();

  const label = isPurePangolinLineage(variant) ? getWHOLabel(variant.name) : undefined;
  const type = isPurePangolinLineage(variant) ? getWHOVariantType(variant.name) : undefined;

  useEffect(() => {
    let isSubscribed = true;
    if (variant.name === undefined) {
      setResolvedFullName(undefined);
      return;
    }
    PangolinLineageAliasResolverService.findFullName(variant.name).then(name => {
      if (isSubscribed) {
        setResolvedFullName(name);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [variant.name]);

  return (
    <div className='ml-3'>
      <div className='flex'>
        <div className='flex-grow flex flex-row items-end'>
          <h1>
            {formatVariantDisplayName(variant)}
            {label && ` (${label})`}
            {!!titleSuffix && ' - '}
            {titleSuffix}
          </h1>
          {<h3 className='pl-1.5 text-gray-500'>{type && ` variant of ${type}`}</h3>}
        </div>
        <div>{controls}</div>
      </div>
      {resolvedFullName && <h3 className=' text-gray-500'>Alias for {resolvedFullName}</h3>}
    </div>
  );
};
