import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getSession } from 'next-auth/client';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  updatedAt: '20 de janeiro de 2021',
  content: '<p>Post Content</p>',
};

jest.mock('next-auth/client');
jest.mock('../../services/prismic.ts');

describe('Post page', () => {
  it('should render correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Content')).toBeInTheDocument();
  });

  it('should redirect user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    });

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post',
        })
      })
    );
  });

  it('should load initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading1', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post Content' }],
        },
        last_publication_date: '01-20-2021',
      }),
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        }
      })
    );
  })
});
