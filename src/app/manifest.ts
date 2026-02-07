import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RentNowPK",
    short_name: "RentNowPK",
    description:
      "Rent a car in Pakistan with RentNowPK. Comparative prices, verified vendors, and reliable service.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C0F11C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
