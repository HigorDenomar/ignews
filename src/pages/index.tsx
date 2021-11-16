import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import styles from '../styles/home.module.scss';
import { stripe } from '../services/stripe';

type Props = {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: Props) {

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br />
            the <span>React</span> world.
          </h1>

          <p>
            Get access to all publications <br />
            <span>for { product.amount } month</span>
          </p>

          <SubscribeButton />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={340}
          height={530}
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JtWlPCE0sTYhXvbNT5ixDx4');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: (60 * 60 * 24), // 1 day
  }
}
