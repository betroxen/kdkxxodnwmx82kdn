import React from 'react';
import { Hero } from '../components/Hero';
import { CoreSections } from '../components/CoreSections';
import { FinalCTA } from '../components/FinalCTA';
import { useAppContext } from '@/context/AppContext'; // Access the global state hook

// We no longer need an interface for props!
const HomePage: React.FC = () => {
  // Access the function directly from the application context
  const { openAuthModal } = useAppContext();
  
  // Define the action: Open the auth modal initialized on the 'register' tab
  const handleRegisterClick = () => openAuthModal('register');

  return (
    <div className="animate-fadeIn">
      {/* Pass the context-derived handler down */}
      <Hero onRegisterClick={handleRegisterClick} />
      <CoreSections />
      <FinalCTA />
    </div>
  );
};

export default HomePage;

