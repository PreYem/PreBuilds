import { truncateText } from "./TruncateText";

export const WEBSITE_NAME: string = "Hello Dino/Fabian";

const setTitle = (pageTitle: string | undefined) => {
  if (pageTitle && pageTitle.trim() !== "") {
    document.title = truncateText(pageTitle, 100) + " | " + WEBSITE_NAME;
  } else {
    document.title = WEBSITE_NAME;
  }
};

export interface TitleType {
  title: string | undefined;
}

export default setTitle;
