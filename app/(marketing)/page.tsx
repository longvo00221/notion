import React from 'react';
import {Heading,Heroes,Footer} from './_components/marketing'

type MarketingPageProps = {
  
};

const MarketingPage:React.FC<MarketingPageProps> = () => {
  
  return <div className='min-h-full flex flex-col'>
    <div className='flex flex-col items-center justify-center md:justify-center text-center gap-y-8 flex-1 px-6 pb-10'>
      <Heading/>
      <Heroes/>
    </div>
    <Footer/>
  </div>
}
export default MarketingPage;