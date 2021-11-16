import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Header';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

jest.mock('next-auth/client', () => ({
  useSession: () => ([null, false]),
}));

describe('Header component', () => {
  it('should render the header', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});
