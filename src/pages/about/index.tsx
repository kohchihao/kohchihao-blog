import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <img
          src={siteConfig.favicon}
          className={styles.profileImage}
          alt="marcus profile picture"
        />
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <div className={clsx('container margin-top--lg margin-bottom--lg')}>
          <div className="row">
            <div className={clsx('col col--6', styles.feature)}>
              <h3>What do I do?</h3>
              <p>
                Hello! I am Marcus. I am a React/ReactNative developer. I am
                currently working in IBM as a React Native engineer building
                features our clients. On weekdays, I work my full time job (as a
                RN engineer) and on weekends, I am a full time exotic succulent
                collector. I specialise in collection{' '}
                <Link
                  to="https://en.wikipedia.org/wiki/Lithops"
                  target="_blank"
                >
                  Lithops
                </Link>{' '}
                /{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/Astrophytum"
                  target="_blank"
                >
                  Astrophytums
                </Link>{' '}
                /{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/Euphorbia_francoisii"
                  target="_blank"
                >
                  Euphorbia Francoisii
                </Link>{' '}
                /{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/Haworthia"
                  target="_blank"
                >
                  Haworthias
                </Link>
                . They are succulents which are usually found in the desert /
                dry tropical climate.
              </p>
            </div>

            <div className={clsx('col col--6', styles.feature)}>
              <h3>What is this?</h3>
              <p>
                Recently (Dec 2022), I have started my new job in IBM and that
                has reignited my passion in technology and specifically
                MicroApps architecture and how we can configure a
                <code>react-native</code> project to make it work. I am also
                interested in designing interfaces for atomic components. So I
                have started this blog to document my findings and my learnings.
              </p>

              <h3>Resume</h3>
              <p>
                You can find my resume{' '}
                <Link href="/kohchihao.pdf" download>
                  here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
