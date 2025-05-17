import style from "../css/about.module.css";
import styles from "../css/contact.module.css";
import Head from 'next/head'; // Still useful for other meta tags

// Import the font function from next/font/google
import { Fjalla_One } from 'next/font/google';

// Initialize the font
const fjallaOne = Fjalla_One({
  weight: '400', // Fajalla One only has '400' weight
  subsets: ['latin'], // Specify subsets you need
  display: 'swap', // Optional: font-display behavior
});

export default function ContactPage() {
  return (
    <>
      {/* No need for the <link> tag in <Head> for this font if using next/font */}
      <Head>
        {/* You can keep other meta tags or links here */}
        <title>Contact Us</title>
      </Head>

      <div
        className={`${styles.container} mt-10!`}
        style={{
          color: "#b6dd9d",
        }}
      >
        <main className={styles.mainContent}>
          <section className={styles.contactSection}>
            <p className={styles.label}>SEND AN EMAIL</p>
            {/* Apply the font's className to the h2 */}
            <h2 className={`${styles.value} ${fjallaOne.className}`}>
              KRISHNA016AGRAWAL@GMAIL.COM
            </h2>
          </section>

          <section className={styles.contactSection}>
            <p className={styles.label}>DROP BY</p>
            <h2 className={`${styles.value} ${fjallaOne.className}`}>
              NEW DELHI
              <br />
              INDIA
            </h2>
          </section>

          <section className={styles.contactSection}>
            <p className={styles.label}>PHONE US</p>
            <h2 className={`${styles.value} ${fjallaOne.className}`}>
              +91 98 9748 1144
            </h2>
          </section>
        </main>

        <div className={`${style.infoLinks} mt-[-100px]!`}>
          <div>
            <span className={fjallaOne.className}>SOCIALS</span>
            <div className={`${style.links} ${fjallaOne.className}`}>
              <a href="https://www.linkedin.com/feed/" target="_blank">LINKEDIN</a>
              <a href="https://www.instagram.com/krishnaagarwal016/?next=%2F" target="_blank">INSTAGRAM</a>
              <a href="https://github.com/krishna016agarwal" target="_blank">GITHUB</a>
            </div>
          </div>
           {/* ... other sections, apply fjallaOne.className where needed ... */}
          <div>
            <span className={fjallaOne.className}>WORK</span>
            <div className={`${style.links} ${fjallaOne.className}`}>
              <a href="/projects">ALL PROJECTS</a>
            </div>
          </div>
          <div>
            <span className={fjallaOne.className}>LET'S TALK</span>
            <div className={`${style.links} ${fjallaOne.className}`}>
              <a href="mailto:krishna016agrawal@gmail.com">EMAIL</a>
              <a href="tel:+919897481144">PHONE</a>
            </div>
          </div>
          <div>
            <span className={fjallaOne.className}>ABOUT</span>
            <div className={`${style.links} ${fjallaOne.className}`}>
              <a href="/about">ABOUT US</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
