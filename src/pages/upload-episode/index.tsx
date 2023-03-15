import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { EpisodeForm, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"

export default function UploadEpisode() {

    const { t } = useTranslation();

    return (
        <div className={uploadEpisodeStyling}>
            <p className="text-white text-xl">{t("uploadepisode.title")}</p>
            <EpisodeForm />
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
  