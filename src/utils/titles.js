
import { fetchPodcastTitles, convertSearchItem } from "./podcast";

export const cacheTitles = async () => {
    if (Date.parse(localStorage.getItem("checkupDate")) <= new Date()) {
      const oldDateObj = new Date();
      const newDateObj = new Date();
      newDateObj.setTime(oldDateObj.getTime() + (20 * 60 * 1000)); // 20 minutes
      localStorage.setItem("checkupDate", newDateObj)
      Promise.all((await fetchPodcastTitles()).map(p => convertSearchItem(p))).then(titles => {
        localStorage.setItem("titles", JSON.stringify(titles));
        return titles;
      })
    } else {
      if (localStorage.getItem("titles")) {
        return JSON.parse(localStorage.getItem("titles"));

      } else {
        Promise.all((await fetchPodcastTitles()).map(p => convertSearchItem(p))).then(titles => {
          localStorage.setItem("titles", JSON.stringify(titles));
          return titles;
        })
      }
    }
  }