// src/lib/auth/withAuth.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export function withAuth(getServerSidePropsFunc?: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      
      if ('props' in result) {
        return {
          ...result,
          props: {
            ...result.props,
            session,
          },
        };
      }
    }

    return {
      props: {
        session,
      },
    };
  };
}

// Example usage in a page:
// export const getServerSideProps = withAuth(async (context) => {
//   return {
//     props: {
//       // Additional props
//     }
//   };
// });