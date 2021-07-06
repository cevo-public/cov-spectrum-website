import React from 'react';
import { ExternalLink } from '../components/ExternalLink';
import { EmailLink } from '../components/EmailLink';
import { VercelSponsorshipLogo } from '../components/VercelSponsorshipLogo';

const Question = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className='w-full bg-yellow-100 shadow-lg mb-6 mt-4 rounded-xl p-4 dark:bg-gray-800'>
      <h2 className='font-bold mb-2 mt-0'>{title}</h2>
      <p>{children}</p>
    </div>
  );
};

const Component = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className='w-full bg-blue-50 shadow-lg mb-6 mt-4 rounded-xl p-4 dark:bg-gray-800'>
      <h2 className='font-bold mb-2 mt-0'>{title}</h2>
      <p>{children}</p>
    </div>
  );
};

const Disclaimer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1>Disclaimer</h1>
      <div className='w-full bg-gray-100 shadow-lg mb-6 mt-4 rounded-xl p-4 dark:bg-gray-800'>
        <p>{children}</p>
      </div>
    </>
  );
};

export const AboutPage = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 md:px-8'>
      <h1>CoV-Spectrum</h1>
      <p>
        Explore up-to-date genome data and monitor variants of SARS-CoV-2! CoV-Spectrum is a fully interactive
        platform aiming to help scientists investigate known variants as well as identifying new ones. It is
        in an early stage of development. Suggestions for improvements, bug reports as well as active
        contributions are highly welcome. Please create an issue in our{' '}
        <ExternalLink url='https://github.com/cevo-public/cov-spectrum-website'>
          Github repository
        </ExternalLink>{' '}
        or send an email to <EmailLink email='chaoran.chen@bsse.ethz.ch' />.
      </p>
      <p>If you would like to reference CoV-Spectrum in scientific works, please cite our pre-print:</p>
      <div className='p-7 bg-gray-100'>
        Chen, C., Nadeau, S., Yared, M., Voinov, P., & Stadler, T.:{' '}
        <ExternalLink url='https://arxiv.org/abs/2106.08106'>
          CoV-Spectrum: Analysis of globally shared SARS-CoV-2 data to Identify and Characterize New Variants
        </ExternalLink>{' '}
        (2021); arXiv: 2106.08106.
      </div>
      <h1>FAQ</h1>
      <Question title='What is a variant?'>
        We distinguish between two ways to specify a variant. A variant can be defined as a clade on the
        phylogenetic tree. This approach is followed by the{' '}
        <ExternalLink url='https://cov-lineages.org/'>pangolin lineages</ExternalLink> which we consider as
        "known variants." Additionally, a variant can be defined as a set of amino acid mutations. On{' '}
        <ExternalLink url='https://covariants.org/'>CoVariants</ExternalLink> and{' '}
        <ExternalLink url='https://cov-lineages.org/global_report.html'>PANGO lineages</ExternalLink> , you
        can find detailed information about variants that are currently of particular interest. Different to
        these websites, CoV-Spectrum does not only show pre-defined variants but provides tools to discover
        and analyze new variants.
      </Question>
      <Question title='Which data do you use?'>
        We use genomic data from GISAID and unreleased/not yet released sequences from the Swiss SARS-CoV-2
        Sequencing Consortium (S3C) complemented by metadata provided by the Federal Office of Public Health
        (FOPH) of Switzerland.
      </Question>
      <p></p>
      <Question title='What is the "Login" and can I gain access?'>
        For Switzerland, we have some confidential data. The access can only be provided to very few people.
        Please contact us if you believe that you are eligible.
      </Question>
      <Question title='What is the "Share" button next to the plots for?'>
        You can embed all the interactive plots of CoV-Spectrum on your own website. Just click on the "Share"
        button and copy and paste the code to your page. The plots will be automatically updated whenever new
        data arrives.
      </Question>
      <Question title='Can I download the numbers behind the plots?'>
        For some of the plots, there is a button next to the plot to download the data as a CSV file.
      </Question>
      <h1>Components</h1>
      <Component title='Known variants list'>
        <p>
          <img
            src='/img/about-known-variants-list.png'
            alt='The known variants list component'
            className='w-full max-w-xl'
          />
        </p>
        <p>
          The known variants are variants defined by the pangolin lineages. With the search (1), it is
          possible to search for a pangolin lineage. To include the sub-lineages of a pangolin lineage, write
          a "*" at the end. For example, "B.1.*" and "B.1*" will use all samples that were classified as "B.1"
          or as a pangolin lineage that starts with "B.1.".
        </p>
        <p>
          In (2), we show a preview of 12 known variants for the past three months with sequencing data.
          Currently, the first 8 are the WHO variants of concerns and are fixed for all countries. The
          remaining 4 are the variants with the most sequenced samples in the past 3 months. The proportion
          number in the preview plots (3) is the prevalence of the variant in the most recent 14 days for
          which sequencing data are available in the selected country.
        </p>
      </Component>

      <Disclaimer>
        <ul className='list-disc'>
          <li>
            Although ETH Zurich takes all possible care to ensure the correctness of published information, no
            warranty can be accepted regarding the correctness, accuracy, uptodateness, reliability and
            completeness of the content of this information.
          </li>
          <li>
            Liability claims against ETH Zurich because of tangible or intangible damage arising from
            accessing, using or not using the published information, through misuse of the connection or as a
            result of technical breakdowns are excluded.
          </li>
        </ul>
      </Disclaimer>

      <h1>Acknowlegements</h1>
      <Component title='FOPH and S3C'>
        We gratefully acknowledge the{' '}
        <ExternalLink url='https://www.bag.admin.ch/'>Federal Office of Public Health (FOPH)</ExternalLink>{' '}
        and all members of the{' '}
        <ExternalLink url='https://bsse.ethz.ch/cevo/research/sars-cov-2/swiss-sequencing-consortium---viollier.html'>
          Swiss SARS-CoV-2 Sequencing Consortium (S3C)
        </ExternalLink>{' '}
        for providing sequence and metadata for Switzerland.
      </Component>

      <Component title='GISAID'>
        We gratefully acknowledge all data contributors, i.e. the Authors and their Originating laboratories
        responsible for obtaining the specimens, and their Submitting laboratories for generating the genetic
        sequence and metadata and sharing via the GISAID Initiative<sup>1</sup> on which this research is
        based.
      </Component>
      <p>
        <sup>1</sup> Elbe, S., and Buckland-Merrett, G. (2017) Data, disease and diplomacy: GISAID’s
        innovative contribution to global health. <i>Global Challenges</i>, 1:33-46. DOI:{' '}
        <ExternalLink url='https://dx.doi.org/10.1002/gch2.1018'>10.1002/gch2.1018</ExternalLink>, PMCID:{' '}
        <ExternalLink url='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6607375/'>31565258</ExternalLink>
      </p>

      <h1 className='font-bold mb-2 mt-4'>Contact</h1>
      <p>
        This project is developed by the{' '}
        <ExternalLink url='https://bsse.ethz.ch/cevo'>Computational Evolution group</ExternalLink> at ETH
        Zurich. For general questions, please contact Chaoran Chen (
        <EmailLink email='chaoran.chen@bsse.ethz.ch' />
        ). For media requests, please reach out to ETH Zurich Media Relations (
        <EmailLink email='mediarelations@hk.ethz.ch' />
        ).
      </p>
      <VercelSponsorshipLogo />
    </div>
  );
};
