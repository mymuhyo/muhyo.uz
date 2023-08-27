import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <a
            href="№"
            // target="_blank"
            rel="noopener noreferrer"
          >
            {/* By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            /> */}
            <h1>MuhYo</h1>
          </a>
        </div>
      </div>

      <div className={styles.center}>
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
        <h1>MuhYo</h1>
      </div>

      <div className={styles.grid}>
        <a
          href="https://about.muhyo.uz"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            About <span>-&gt;</span>
          </h2>
          <p>This page for about me</p>
        </a>

        <a
          href="https://blog.muhyo.uz"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Blog <span>-&gt;</span>
          </h2>
          <p>This is my personal blog</p>
        </a>

        <a
          href="https://tweb.muhyo.uz"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Telegram <span>-&gt;</span>
          </h2>
          <p>This is my unofficial telegram web project.</p>
        </a>

        {/* <a
          href=""
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a> */}
      </div>
    </main>
  )
}
