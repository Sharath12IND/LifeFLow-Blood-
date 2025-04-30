import React from 'react';
import EmergencyAlert from '@/components/EmergencyAlert';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import BloodFacts from '@/components/BloodFacts';
import HospitalMap from '@/components/HospitalMap';
import CallToAction from '@/components/CallToAction';

const Home: React.FC = () => {
  return (
    <>
      <EmergencyAlert />
      <HeroSection />
      <StatsSection />
      <BloodFacts />
      <HospitalMap />
      <CallToAction />
    </>
  );
};

export default Home;
