import { useEffect } from "react";

export const WEBSITE_NAME: string = "PreBuilds";

const setTitle = (pageTitle: string) => {
  useEffect(() => {
    document.title = pageTitle + " | " + WEBSITE_NAME;
  }, [pageTitle]);
};

export interface TitleType {
  title: string;
}

export default setTitle;
