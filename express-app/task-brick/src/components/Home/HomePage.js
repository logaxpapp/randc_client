import React from 'react';
import HeroPage from './HeroPage'
import FeatureProduct from './FeatureProduct'
import Trust from './Trust'
import FeatureList from './AgileToolsComponent'
import TemplatesComponent from './TemplatesComponent'
import InsightComponent from './InsightComponent'
import Subscription from './Subscription'
import CategoryCarousel from './CategoryCarousel';
import Recommended from './Recommended'
import EventList from './EventList';

function HomePage() {
  return (
    <div >
      <HeroPage />
      <Recommended />
      <EventList />
      <Trust />
      <FeatureList />
      <TemplatesComponent />
      <InsightComponent />
      <Subscription />

      <FeatureProduct />
      <CategoryCarousel />
    </div>
   
  )
}

export default HomePage