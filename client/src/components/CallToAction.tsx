import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import BloodDropLogo from './BloodDropLogo';

const CallToAction: React.FC = () => {
  return (
    <section className="bg-primary-600 relative overflow-hidden">
      {/* Animated Blood Drop Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'scale(1.5)',
            }}
            animate={{
              y: [0, 100, 0],
              x: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          >
            <BloodDropLogo size="lg" />
          </motion.div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to save lives?</span>
            <span className="block text-primary-200">Join our donor community today.</span>
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-md">
            Your donation can make a critical difference in emergency situations. Be a hero in someone's story.
          </p>
        </motion.div>
        
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <motion.div 
            className="inline-flex rounded-md shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/donor-registration">
              <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 cursor-pointer">
                <BloodDropLogo size="sm" className="mr-2" animated />
                Become a Donor
              </div>
            </Link>
          </motion.div>
          <motion.div 
            className="ml-3 inline-flex rounded-md shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/request-blood">
              <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800 cursor-pointer">
                <i className="fas fa-heartbeat mr-2"></i>
                Request Blood
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
