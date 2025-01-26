
import SubscriptionSection from './components/SubscriptionSection';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import MapSection from './components/MapSection';
import SearchBarDropdown from '../../components/SearchBarDropdown';
import TeamSection from './components/TeamSection';
import Recommended from './components/Recommended';
import CosmicHero from './components/CosmicHero';

function HomePage() {
  return (
    <div className="jost text-gray-900">
     <div className="hidden md:block">
     <SearchBarDropdown />
     </div>
     
      <HeroSection />
      <FeaturesSection />
      <CosmicHero />
      <Recommended />
      <MapSection />
      < SubscriptionSection />
      <TeamSection />
    </div>
  );
}

export default HomePage;
