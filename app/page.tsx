import Hero from "../components/components/sections/Hero";
import Features from "../components/homepageComponents/Features"
import Testimonials from "../components/homepageComponents/Testimonials"
import Footer from "../components/homepageComponents/Footer"

export default function Home() {
  return (
    <>
      <main className="h-screen flex flex-col">
        <Hero />
        <div className="pl-5 pr-5 md:pl-10 md:pr-10">
        <Features />
        <Testimonials />
        <Footer />
        </div>
      </main>
    </>
  );
}
