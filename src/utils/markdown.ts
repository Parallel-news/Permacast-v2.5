import axios from "axios";
import { ARSEED_URL } from "../constants";
import { arweaveTX } from "../interfaces";
import { podcastDescriptionManager } from "./localstorage";
import { validateArweaveTX } from "./validation/arweave";



export const queryMarkdownByTX = async (description: arweaveTX): Promise<string> => {
  if (!validateArweaveTX(description)) return description;
  const savedDescription = podcastDescriptionManager.getValueFromObject(description);
  if (savedDescription) return savedDescription;

  try {
    const text = (await axios.get(ARSEED_URL + description)).data;
    podcastDescriptionManager.addValueToObject(description, text);  
    return text;
  } catch (error) {
    console.log(error);
    return '';
  };
};
