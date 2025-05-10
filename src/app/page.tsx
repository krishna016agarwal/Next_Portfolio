import Hero from "./components/hero"
import style from "./css/about.module.css"

export default function Home() {
  return (
    <main className="min-h-screen  text-white px-6 md:px-20 py-10">
    
      <Hero />
                  <div className={style.infoLinks}>
              <div>
                <span>SOCIALS</span>
                <a href="https://www.linkedin.com/feed/" target="_blank">
                  LINKEDIN
                </a>
                <a
                  href="https://www.instagram.com/krishnaagarwal016/?next=%2F"
                  target="_blank"
                >
                  INSTAGRAM
                </a>
                <a href="https://github.com/krishna016agarwal" target="_blank">
                  GITHUB
                </a>
              </div>
              <div>
                <span>WORK</span>
                <a href="/projects">ALL PROJECTS</a>
              </div>
              <div>
                <span>LET'S TALK</span>
                <a href="krishna016agrawal@gmail.com">EMAIL</a>
                <a href="tel:+9897481144">PHONE</a>
              </div>
              <div>
                <span>ABOUT</span>
                <a href="/about">ABOUT US</a>
              </div>
            </div>
    </main>
  );
}
