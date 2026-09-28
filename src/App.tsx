import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Composition from "./components/sections/Composition";
import Seasons from "./components/sections/Seasons";
import Plan from "./components/sections/Plan";
import DestinationsMap from "./components/sections/DestinationsMap";
import Footer from "./components/sections/Footer";

export default function App() {
  return (
    <>
      <main className="relative z-[1] mb-[calc(100vh+2px)] bg-bone">
        <Hero />
        <div className="relative z-10 -mt-[100svh]">
          <About />
          <Composition />
          <Seasons />
          <Plan />
          <DestinationsMap />
        </div>
      </main>
      <Footer />
    </>
  );
}
