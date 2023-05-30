
//<FeaturedPodcastCarousel podcasts={podcasts} />

import { useState } from "react"
import { ProgressBar } from "../../component/progressBar"

export default function Test() {

    const [progress, setProgress] = useState<string>("0")
    return (
        <div className="w-full m-auto">
            <ProgressBar progress={progress} colorHex={"#A020F0"}/>
            <div className="mt-4">
                <button onClick={() => setProgress("45")}>
                    45
                </button>
                <button onClick={() => setProgress("25")}>
                    25
                </button>
                <button onClick={() => setProgress("100")}>
                    100
                </button>
            </div>
        </div>
    )
}