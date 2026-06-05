import ReactGA from "react-ga4";

export const initAnalytics = () => {
  ReactGA.initialize("G-HFR4MML99E");
};

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};
