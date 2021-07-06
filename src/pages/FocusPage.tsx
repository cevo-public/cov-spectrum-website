import { mapValues } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AsyncState } from 'react-async';
import { AsyncVariantInternationalComparisonPlot } from '../components/AsyncVariantInternationalComparisonPlot';
import { ExportButton } from '../components/CombinedExport/ExportButton';
import { ExportManager, ExportManagerContext } from '../components/CombinedExport/ExportManager';
import { FocusVariantHeaderControls } from '../components/FocusVariantHeaderControls';
import Loader from '../components/Loader';
import { NamedCard, NamedCardStyle } from '../components/NamedCard';
import { GridCell, PackedGrid } from '../components/PackedGrid';
import Switzerland from '../components/Switzerland';
import { VariantHeader } from '../components/VariantHeader';
import { VariantLineages } from '../components/VariantLineages';
import { VariantMutations } from '../components/VariantMutations';
import { getFocusPageLink } from '../helpers/explore-url';
import { SampleSetWithSelector } from '../helpers/sample-set';
import { SequencingIntensityEntrySetWithSelector } from '../helpers/sequencing-intensity-entry-set';
import { Alert, AlertVariant, Button, ButtonVariant, ShowMoreButton } from '../helpers/ui';
import { Chen2021FitnessPreview } from '../models/chen2021Fitness/Chen2021FitnessPreview';
import { filter, getData } from '../models/wasteWater/loading';
import { WasteWaterDataset } from '../models/wasteWater/types';
import { WASTE_WATER_AVAILABLE_LINEAGES } from '../models/wasteWater/WasteWaterDeepFocus';
import { WasteWaterSummaryTimeWidget } from '../models/wasteWater/WasteWaterSummaryTimeWidget';
import { AccountService } from '../services/AccountService';
import { DateRange, isRegion, SamplingStrategy, toLiteralSamplingStrategy } from '../services/api';
import { Country, Variant } from '../services/api-types';
import { ArticleListWidget } from '../widgets/ArticleList';
import { EstimatedCasesPlotWidget } from '../widgets/EstimatedCasesPlot';
import { HospitalizationDeathPlotWidget } from '../widgets/HospitalizationDeathPlot';
import { VariantAgeDistributionPlotWidget } from '../widgets/VariantAgeDistributionPlot';
import { VariantDivisionDistributionTableWidget } from '../widgets/VariantDivisionDistributionTable';
import { VariantTimeDistributionPlotWidget } from '../widgets/VariantTimeDistributionPlot';
import { VariantSelector } from '../helpers/sample-selector';
import { DivisionModal } from '../components/DivisionModal';
import { SwitzerlandEstimatedCasesDivisionModal } from '../components/SwitzerlandEstimatedCasesDivisionModal';

interface Props {
  country: Country;
  matchPercentage: number;
  variant: Variant;
  samplingStrategy: SamplingStrategy;
  dateRange: DateRange;
  variantSampleSet: SampleSetWithSelector;
  wholeSampleSet: SampleSetWithSelector;
  variantInternationalSampleSetState: AsyncState<SampleSetWithSelector>;
  wholeInternationalSampleSetState: AsyncState<SampleSetWithSelector>;
  sequencingIntensityEntrySet: SequencingIntensityEntrySetWithSelector;
  onVariantSelect: (selection: VariantSelector) => void;
}

const deepFocusPaths = {
  internationalComparison: '/international-comparison',
  chen2021Fitness: '/chen-2021-fitness',
  hospitalizationAndDeath: '/hospitalization-death',
  wasteWater: '/waste-water',
};

const createDivisionBreakdownButton = (setter: (show: boolean) => void) => (
  <Button
    className='mt-1 ml-2'
    variant={ButtonVariant.PRIMARY}
    onClick={() => {
      setter(true);
    }}
  >
    Show regions
  </Button>
);

export const FocusPage = ({
  variantSampleSet,
  wholeSampleSet,
  variantInternationalSampleSetState,
  wholeInternationalSampleSetState,
  sequencingIntensityEntrySet,
  onVariantSelect,
  ...forwardedProps
}: Props) => {
  const { country, matchPercentage, variant, samplingStrategy, dateRange } = forwardedProps;
  const [showVariantTimeDistributionDivGrid, setShowVariantTimeDistributionDivGrid] = useState(false);
  const [showEstimatedCasesDivGrid, setShowEstimatedCasesDivGrid] = useState(false);
  const [showVariantAgeDistributionDivGrid, setShowVariantAgeDistributionDivGrid] = useState(false);

  const plotProps = {
    country,
    matchPercentage,
    mutations: variant.mutations,
    pangolinLineage: variant.name,
    samplingStrategy: toLiteralSamplingStrategy(samplingStrategy),
    dateRange,
  };

  const loggedIn = AccountService.isLoggedIn();

  const deepFocusButtons = useMemo(
    () =>
      mapValues(deepFocusPaths, suffix => {
        const to = getFocusPageLink({
          variantSelector: { variant, matchPercentage },
          country,
          samplingStrategy,
          dateRange,
          deepFocusPath: suffix,
        });
        return <ShowMoreButton to={to} />;
      }),
    [country, samplingStrategy, dateRange, matchPercentage, variant]
  );

  const [wasteWaterData, setWasteWaterData] = useState<WasteWaterDataset | undefined>(undefined);
  useEffect(() => {
    if (!variant.name) {
      return;
    }
    getData({
      country,
    }).then(dataset => dataset && setWasteWaterData(filter(dataset, variant.name)));
  }, [country, variant.name]);

  const mapExportManagerRef = useRef(new ExportManager());

  const header = (
    <VariantHeader
      variant={variant}
      place={country}
      controls={<FocusVariantHeaderControls {...forwardedProps} />}
    />
  );

  if (variantSampleSet.isEmpty()) {
    return <Alert variant={AlertVariant.WARNING}>No samples match your query</Alert>;
  }

  let wasteWaterSummaryPlot = undefined;
  if (country === 'Switzerland' && variant.name && WASTE_WATER_AVAILABLE_LINEAGES.includes(variant.name)) {
    if (wasteWaterData) {
      wasteWaterSummaryPlot = (
        <GridCell minWidth={600}>
          <WasteWaterSummaryTimeWidget.ShareableComponent
            country={country}
            title='Wastewater prevalence'
            variantName={variant.name}
            wasteWaterPlants={wasteWaterData.map(({ location, data }) => ({
              location,
              data: data.timeseriesSummary,
            }))}
            height={300}
            toolbarChildren={deepFocusButtons.wasteWater}
          />
        </GridCell>
      );
    } else {
      wasteWaterSummaryPlot = (
        <GridCell minWidth={600}>
          <NamedCard title='Wastewater prevalence' toolbar={deepFocusButtons.wasteWater}>
            <div style={{ height: 300, width: '100%' }}>
              <Loader />
            </div>
          </NamedCard>
        </GridCell>
      );
    }
  }

  return (
    <>
      <div>
        {header}
        {variant.mutations.length > 0 && matchPercentage !== 1 && (
          <p style={{ marginBottom: '30px' }}>
            The following plots show sequences matching <b>{Math.round(matchPercentage * 100)}%</b> of the
            mutations.
          </p>
        )}

        {(!variant.name || variant.name.endsWith('*')) && (
          <div className='m-4'>
            <VariantLineages onVariantSelect={onVariantSelect} {...forwardedProps} />{' '}
          </div>
        )}
        <PackedGrid maxColumns={2}>
          <GridCell minWidth={600}>
            <VariantTimeDistributionPlotWidget.ShareableComponent
              variantSampleSet={variantSampleSet}
              wholeSampleSet={wholeSampleSet}
              height={300}
              title='Sequences over time'
              toolbarChildren={[createDivisionBreakdownButton(setShowVariantTimeDistributionDivGrid)]}
            />
          </GridCell>
          <GridCell minWidth={600}>
            <EstimatedCasesPlotWidget.ShareableComponent
              variantSampleSet={variantSampleSet}
              sequencingIntensityEntrySet={sequencingIntensityEntrySet}
              height={300}
              title='Estimated cases'
              toolbarChildren={
                country === 'Switzerland' ? [createDivisionBreakdownButton(setShowEstimatedCasesDivGrid)] : []
              }
            />
          </GridCell>
          <GridCell minWidth={600}>
            <VariantAgeDistributionPlotWidget.ShareableComponent
              variantSampleSet={variantSampleSet}
              wholeSampleSet={wholeSampleSet}
              height={300}
              title='Age demographics'
              toolbarChildren={[createDivisionBreakdownButton(setShowVariantAgeDistributionDivGrid)]}
            />
          </GridCell>
          {country === 'Switzerland' && (
            <GridCell minWidth={600}>
              <HospitalizationDeathPlotWidget.ShareableComponent
                field='hospitalized'
                variantSampleSet={variantSampleSet}
                wholeSampleSet={wholeSampleSet}
                variantName={variant.name || 'unnamed variant'}
                title='Hospitalization probabilities'
                height={300}
                toolbarChildren={deepFocusButtons.hospitalizationAndDeath}
              />
            </GridCell>
          )}
          {!isRegion(country) && (
            <GridCell minWidth={600}>
              <NamedCard
                title='Transmission advantage'
                toolbar={deepFocusButtons.chen2021Fitness}
                description={`
              How easily this variant gets transmitted. This variant's so-called "advantage" may decrease as other more transmittable ones spread.
              This assumes variants spread pre-dominantly by local transmission across demographic groups. When absolute numbers of a variant are
                low, the advantage may merely reflect the current importance of introductions from abroad or
                 the variant spreading in a particular demographic group. In this case, the estimate does not
                  provide information on the transmission advantage.`}
              >
                <div style={{ height: 300 }}>
                  <Chen2021FitnessPreview {...plotProps} />
                </div>
              </NamedCard>
            </GridCell>
          )}
          <GridCell minWidth={600}>
            <VariantDivisionDistributionTableWidget.ShareableComponent
              variantSampleSet={variantSampleSet}
              wholeSampleSet={wholeSampleSet}
              title='Geographic distribution'
            />
          </GridCell>
          {loggedIn && country === 'Switzerland' && (
            <GridCell minWidth={600}>
              <ExportManagerContext.Provider value={mapExportManagerRef.current}>
                <NamedCard
                  title='Geographic distribution'
                  style={NamedCardStyle.CONFIDENTIAL}
                  toolbar={<ExportButton className='mt-1 ml-1' />}
                >
                  <Switzerland variantSampleSet={variantSampleSet} />
                </NamedCard>
              </ExportManagerContext.Provider>
            </GridCell>
          )}
          {wasteWaterSummaryPlot}
          {samplingStrategy === SamplingStrategy.AllSamples && (
            <GridCell minWidth={600}>
              <AsyncVariantInternationalComparisonPlot
                height={300}
                title='International comparison'
                toolbarChildren={deepFocusButtons.internationalComparison}
                country={country}
                variantInternationalSampleSetState={variantInternationalSampleSetState}
                wholeInternationalSampleSetState={wholeInternationalSampleSetState}
              />
            </GridCell>
          )}
          {variant.name && variant.mutations.length === 0 && (
            <GridCell minWidth={800}>
              <ArticleListWidget.ShareableComponent
                title='Publications and pre-Prints'
                pangolinLineage={variant.name}
              />
            </GridCell>
          )}
        </PackedGrid>

        {variant.name && variant.mutations.length === 0 && (
          <div className='m-4'>
            <VariantMutations
              country={forwardedProps.country}
              pangolinLineage={variant.name}
              dateRange={forwardedProps.dateRange}
            />
          </div>
        )}
      </div>

      {/* The division breakdown plots */}
      {showVariantTimeDistributionDivGrid && (
        <DivisionModal
          variantSampleSet={variantSampleSet}
          wholeSampleSet={wholeSampleSet}
          generate={(d, v, w) => (
            <VariantTimeDistributionPlotWidget.ShareableComponent
              variantSampleSet={v}
              wholeSampleSet={w}
              height={300}
              title={d}
              showExport={false}
            />
          )}
          show={showVariantTimeDistributionDivGrid}
          handleClose={() => setShowVariantTimeDistributionDivGrid(false)}
          header='Sequences over time'
        />
      )}
      {showEstimatedCasesDivGrid && country === 'Switzerland' && (
        <SwitzerlandEstimatedCasesDivisionModal
          variantSampleSet={variantSampleSet}
          wholeSampleSet={wholeSampleSet}
          show={showEstimatedCasesDivGrid}
          handleClose={() => setShowEstimatedCasesDivGrid(false)}
        />
      )}
      {showVariantAgeDistributionDivGrid && (
        <DivisionModal
          variantSampleSet={variantSampleSet}
          wholeSampleSet={wholeSampleSet}
          generate={(d, v, w) => (
            <VariantAgeDistributionPlotWidget.ShareableComponent
              variantSampleSet={v}
              wholeSampleSet={w}
              height={300}
              title={d}
              showExport={false}
            />
          )}
          show={showVariantAgeDistributionDivGrid}
          handleClose={() => setShowVariantAgeDistributionDivGrid(false)}
          header='Age demographics'
        />
      )}
    </>
  );
};
