import { EpisodeForm, uploadEpisodeStyling } from "../../component/uploadEpisode/uploadEpisodeTools"

export default function UploadEpisode() {
    return (
        <div className={uploadEpisodeStyling}>
            <p className="text-white text-xl">Upload Episode</p>
            <EpisodeForm />
        </div>
    )
}