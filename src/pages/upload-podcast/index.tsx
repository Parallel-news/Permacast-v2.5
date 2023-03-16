import { ShowForm, uploadShowStyling, showTitleStyling } from "../../component/uploadShow/uploadShowTools"

export default function UploadShow() {
    return (
        <div className={uploadShowStyling}>
            <p className={showTitleStyling}>Add Show</p>
            <ShowForm />
        </div>
    )
}