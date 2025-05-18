import Footer from "./components/footer";
import Hero from "./components/hero"
import style from "./css/about.module.css"

export default function Home() {
  return (
    <main className="min-h-screen  text-white px-6 md:px-20 py-10">
    
      <Hero />
                  <Footer></Footer>
    </main>
  );
}
