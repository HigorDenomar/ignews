import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';

import Home, { getStaticProps } from '../../pages';

jest.mock('next/router')
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));
jest.mock('../../services/stripe.ts');

describe('Home page', () => {
  it('should render correctly', () => {
    render(<Home product={{ priceId: 'fake-priceId', amount: 'R$10,00' }} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    const retrieveStripePriceMocked = mocked(stripe.prices.retrieve);

    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: '1000',
      currency: 'BRL'
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: 'R$10.00'
          }
        }
      })
    );
  });
});
