import Head from 'next/head';

import styles from '../../styles/posts.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>09 de novembro de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, dolorum necessitatibus commodi sit voluptas consequatur?</p>
          </a>
          <a href="#">
            <time>09 de novembro de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, dolorum necessitatibus commodi sit voluptas consequatur?</p>
          </a>
          <a href="#">
            <time>09 de novembro de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, dolorum necessitatibus commodi sit voluptas consequatur?</p>
          </a>
        </div>
      </main>
    </>
  );
}
