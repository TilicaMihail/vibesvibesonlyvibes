import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import Roles from '@/components/landing/Roles'
import FAQ from '@/components/landing/FAQ'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#f6f3e7', color: '#29241f' }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Roles />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}
