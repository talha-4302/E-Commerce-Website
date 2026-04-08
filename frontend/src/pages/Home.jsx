import React from 'react'
import Hero from '../components/Hero.jsx'
import LatestCollection from './../components/LatestCollection'
import FeatureSection from '../components/FeatureSection'
import NewsletterSection from '../components/NewsletterSection'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <FeatureSection />
      <NewsletterSection />
    </div>
  )
}

export default Home
