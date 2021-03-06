import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../../services/prismic';

import styles from '../../../styles/post.module.scss';

type Props = {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
};

export default function PostPreview({ post }: Props) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }

    console.log(session)
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.content} ${styles.preview}`}
            dangerouslySetInnerHTML={{ __html: post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?

            <Link href="/">
              <a>Subscribe new 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const { results } = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    pageSize: 30,
  });

  const paths = results.map(post => ({
    params: {
      slug: post.uid
    }
  }));

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  if(!response) {
    return {
      notFound: true,
    }
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    props: {
      post,
    },
    revalidate: (60 * 60) // 1 hour
  };
}
