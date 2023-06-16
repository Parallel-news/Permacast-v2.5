import { isFullscreenAtom, loadingPage } from "@/atoms/index";
import { useRecoilState } from "recoil";

type OnCFunction = (startLoad?: boolean, timeout?: number) => void;

export default function useNavOnclick(): { onC: OnCFunction } {
  const [, setIsFullscreen] = useRecoilState(isFullscreenAtom);
  const [, setLoadingPage] = useRecoilState(loadingPage);
  const engageLoading = () => setLoadingPage(true);

  const onC = (startLoad = true, timeout = 1000) => {
    setIsFullscreen(false);
    if (startLoad) {
      engageLoading();
      setTimeout(() => setLoadingPage(false), timeout);
    }
  };

  return { onC };
}