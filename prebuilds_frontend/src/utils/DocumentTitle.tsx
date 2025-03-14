import { useEffect } from "react";

export const WEBSITE_NAME = "PreBuilds";

const setTitle = (pageTitle: string) => {
  useEffect(() => {
    document.title = pageTitle + " | " + WEBSITE_NAME;
  }, [pageTitle]);
};

export default setTitle;
