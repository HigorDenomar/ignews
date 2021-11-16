import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  updatedAt: '20 de janeiro de 2021',
  content: '<p>Post Content</p>',
};

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../services/prismic.ts');

describe('Post preview page', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValue([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('should redirect user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValue([{
      activeSubscription: 'fake-active-subscription'
    }, false] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any);

    render(<Post post={post} />);

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading1', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post Content' }],
        },
        last_publication_date: '01-20-2021',
      }),
    } as any);

    const response = await getStaticProps({
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
  });
});
