import Hero from '../components/Hero';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import PopularDestinations from '../components/PopularDestinations';
import Trips from '../components/Trips';

function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Trips />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <PopularDestinations />
    </div>
  );
}

export default Home;