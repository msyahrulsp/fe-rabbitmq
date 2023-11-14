import { Center } from '@chakra-ui/react';
import { useEffect } from 'react';

interface Props {
  title?: string;
  children: React.ReactNode;
  bg: string;
}

export const Layout = ({ title, children, bg }: Props) => {
  useEffect(() => {
    document.title = title
      ? `${title} | Camunda FE Mockup`
      : 'Camunda FE Mockup';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Center
      minH="100vh"
      bgImage={bg}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center center"
    >
      {children}
    </Center>
  );
};
