import axios from "axios";
import { ARSEED_URL } from "../constants";
import { arweaveTX } from "../interfaces";
import { podcastDescriptionManager } from "./localstorage";



export const queryMarkdown = async (description: arweaveTX): Promise<string> => {
  const savedDescription = podcastDescriptionManager.getValueFromObject(description);
  if (savedDescription) return savedDescription;
  const text = (await axios.get(ARSEED_URL + description)).data;
  podcastDescriptionManager.addValueToObject(description, text);
  return text;
}