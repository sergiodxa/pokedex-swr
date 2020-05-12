import "../styles.css";

export function reportWebVitals(metric) {
  console.log(metric);
}

export default function App({ Component, pageProps }) {
  return <main className="font-sans"><Component {...pageProps} /></<main>;
}
