import { episodeTitleStyling } from "../../component/uploadEpisode/uploadEpisodeTools"
import { ShowForm } from "../../component/uploadShow/uploadShowTools"

export default function UploadShow() {
    return (
        <div className="w-full flex flex-col justify-center items-center space-y-3">
            <p className={episodeTitleStyling}>Add Show</p>
            <ShowForm />
        </div>
    )
}