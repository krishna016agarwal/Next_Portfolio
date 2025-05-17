import style from "../css/about.module.css";
import styles from "../css/contact.module.css"; // Adjust path if your css folder is elsewhere

// Initialize the Fajlla One font

export default function ContactPage() {
  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
          rel="stylesheet"
        />
      </head>

      <div
        className={`${styles.container} mt-10!`}
        style={{
          fontFamily: "Fjalla One",
          
          color: "#b6dd9d",
        }}
      >
        <main className={styles.mainContent}>
          <section className={styles.contactSection}>
            <p className={styles.label}>SEND AN EMAIL</p>
            <h2 className={styles.value}>KRISHNA016AGRAWAL@GMAIL.COM</h2>
          </section>

          <section className={styles.contactSection}>
            <p className={styles.label}>DROP BY</p>
            <h2 className={styles.value}>
              NEW DELHI
              <br />
              INDIA
            </h2>
          </section>

          <section className={styles.contactSection}>
            <p className={styles.label}>PHONE US</p>
            <h2 className={styles.value}>+91 98 9748 1144</h2>
          </section>
        </main>
        <div className={`${style.infoLinks} mt-[-120px]!`}>
          <div>
            <span>SOCIALS</span>
            <div className={style.links}>
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
          </div>
          <div>
            <span>WORK</span>
            <div className={style.links}>
              {" "}
              <a href="/projects">ALL PROJECTS</a>
            </div>
          </div>
          <div>
            <span>LET'S TALK</span>
            <div className={style.links}>
              <a href="krishna016agrawal@gmail.com">EMAIL</a>
              <a href="tel:+9897481144">PHONE</a>
            </div>
          </div>
          <div>
            <span>ABOUT</span>
            <div className={style.links}>
              <a href="/about">ABOUT US</a>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
