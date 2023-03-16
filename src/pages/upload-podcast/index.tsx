import { episodeTitleStyling } from "../../component/uploadEpisode/uploadEpisodeTools"
import { ShowForm, uploadShowStyling } from "../../component/uploadShow/uploadShowTools"

export default function UploadShow() {
    return (
        <div className={uploadShowStyling}>
            <p className={episodeTitleStyling}>Add Show</p>
            <ShowForm />
        </div>
    )
}