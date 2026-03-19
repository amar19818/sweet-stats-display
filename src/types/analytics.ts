export interface AnalyticsData {
  url: {
    shortUrl: string;
    longUrl: string;
    createdAt: string;
  };
  totalClicks: number;
  topCountries: { _id: string; count: number }[];
  deviceBreakdown: { _id: string; count: number }[];
  browserBreakdown: { _id: string; count: number }[];
  osBreakdown: { _id: string; count: number }[];
  topReferrers: { _id: string; count: number }[];
  clicksPerDay: { _id: string; count: number }[];
  recentClicks: {
    timestamp: string;
    country: string;
    device: string;
    browser: string;
    referrer: string;
  }[];
  fromCache: boolean;
}
