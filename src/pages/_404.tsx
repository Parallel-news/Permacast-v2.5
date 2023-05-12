import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function NotFound() {
  return (
    <div>
      You idiot you broke it
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}  
