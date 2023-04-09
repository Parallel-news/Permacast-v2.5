import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ScrollUpLink = ({ href, children, ...rest }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url !== router.asPath) {
        window.scrollTo(0, 0);
      }
    };

    router.events.on('beforeHistoryChange', handleRouteChange);

    return () => {
      router.events.off('beforeHistoryChange', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
};

export default ScrollUpLink;