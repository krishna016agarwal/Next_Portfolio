'use client'
import style from "../css/about.module.css";
import styles from "../css/contact.module.css";
import Head from 'next/head'; // Still useful for other meta tags

// Import the font function from next/font/google
import { Fjalla_One } from 'next/font/google';
import Footer from "../components/footer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Initialize the font
const fjallaOne = Fjalla_One({
  weight: '400', // Fajalla One only has '400' weight
  subsets: ['latin'], // Specify subsets you need
  display: 'swap', // Optional: font-display behavior
});

export default function ContactPage() {
  const tl=gsap.timeline();
  useGSAP(()=>{
    gsap.from(".label",{
y:50,
delay:.1,
stagger:.5,
opacity:0,
duration:1
    })
      gsap.from(".value",{
y:50,
delay:.4,
stagger:.5,
opacity:0,
duration:1
    })
  })
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
            <p className={`${styles.label} label`}>SEND AN EMAIL</p>
            {/* Apply the font's className to the h2 */}
            <h2 className={`${styles.value} value ${fjallaOne.className}`}>
              KRISHNA016AGRAWAL@GMAIL.COM
            </h2>
          </section>

          <section className={styles.contactSection}>
            <p className={`${styles.label} label`}>DROP BY</p>
            <h2 className={`${styles.value} value ${fjallaOne.className}`}>
              NEW DELHI
              <br />
              INDIA
            </h2>
          </section>

          <section className={styles.contactSection}>
            <p className={`${styles.label} label`}>PHONE US</p>
            <h2 className={`${styles.value} value ${fjallaOne.className}`}>
              +91 98 9748 1144
            </h2>
          </section>
        </main>
<div className="mt-[-100px]!">
  <Footer ></Footer>
</div>
       
      </div>
    </>
  );
}
