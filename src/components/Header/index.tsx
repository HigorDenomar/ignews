import Image from 'next/image';

import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/images/logo.svg"
          alt="ig.news"
          width={110}
          height={40}
        />

        <nav>
          <ActiveLink
            activeClassName={styles.active}
            href="/"
          >
            <a>Home</a>
          </ActiveLink>

          <ActiveLink
            href="/posts"
            activeClassName={styles.active}
            prefetch
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
