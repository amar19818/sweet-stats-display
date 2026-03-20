import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO-2 to ISO-3 mapping for common countries
const iso2to3: Record<string, string> = {
  AF:"AFG",AL:"ALB",DZ:"DZA",AD:"AND",AO:"AGO",AG:"ATG",AR:"ARG",AM:"ARM",AU:"AUS",AT:"AUT",
  AZ:"AZE",BS:"BHS",BH:"BHR",BD:"BGD",BB:"BRB",BY:"BLR",BE:"BEL",BZ:"BLZ",BJ:"BEN",BT:"BTN",
  BO:"BOL",BA:"BIH",BW:"BWA",BR:"BRA",BN:"BRN",BG:"BGR",BF:"BFA",BI:"BDI",KH:"KHM",CM:"CMR",
  CA:"CAN",CF:"CAF",TD:"TCD",CL:"CHL",CN:"CHN",CO:"COL",KM:"COM",CG:"COG",CD:"COD",CR:"CRI",
  CI:"CIV",HR:"HRV",CU:"CUB",CY:"CYP",CZ:"CZE",DK:"DNK",DJ:"DJI",DM:"DMA",DO:"DOM",EC:"ECU",
  EG:"EGY",SV:"SLV",GQ:"GNQ",ER:"ERI",EE:"EST",ET:"ETH",FJ:"FJI",FI:"FIN",FR:"FRA",GA:"GAB",
  GM:"GMB",GE:"GEO",DE:"DEU",GH:"GHA",GR:"GRC",GT:"GTM",GN:"GIN",GW:"GNB",GY:"GUY",HT:"HTI",
  HN:"HND",HU:"HUN",IS:"ISL",IN:"IND",ID:"IDN",IR:"IRN",IQ:"IRQ",IE:"IRL",IL:"ISR",IT:"ITA",
  JM:"JAM",JP:"JPN",JO:"JOR",KZ:"KAZ",KE:"KEN",KR:"KOR",KW:"KWT",KG:"KGZ",LA:"LAO",LV:"LVA",
  LB:"LBN",LS:"LSO",LR:"LBR",LY:"LBY",LT:"LTU",LU:"LUX",MK:"MKD",MG:"MDG",MW:"MWI",MY:"MYS",
  ML:"MLI",MT:"MLT",MR:"MRT",MU:"MUS",MX:"MEX",MD:"MDA",MN:"MNG",ME:"MNE",MA:"MAR",MZ:"MOZ",
  MM:"MMR",NA:"NAM",NP:"NPL",NL:"NLD",NZ:"NZL",NI:"NIC",NE:"NER",NG:"NGA",NO:"NOR",OM:"OMN",
  PK:"PAK",PA:"PAN",PG:"PNG",PY:"PRY",PE:"PER",PH:"PHL",PL:"POL",PT:"PRT",QA:"QAT",RO:"ROU",
  RU:"RUS",RW:"RWA",SA:"SAU",SN:"SEN",RS:"SRB",SL:"SLE",SG:"SGP",SK:"SVK",SI:"SVN",SO:"SOM",
  ZA:"ZAF",ES:"ESP",LK:"LKA",SD:"SDN",SR:"SUR",SZ:"SWZ",SE:"SWE",CH:"CHE",SY:"SYR",TW:"TWN",
  TJ:"TJK",TZ:"TZA",TH:"THA",TG:"TGO",TT:"TTO",TN:"TUN",TR:"TUR",TM:"TKM",UG:"UGA",UA:"UKR",
  AE:"ARE",GB:"GBR",US:"USA",UY:"URY",UZ:"UZB",VE:"VEN",VN:"VNM",YE:"YEM",ZM:"ZMB",ZW:"ZWE",
};

interface Props {
  data: { _id: string; count: number }[];
}

export default function WorldMapChart({ data }: Props) {
  const { countryMap, maxCount } = useMemo(() => {
    const map: Record<string, number> = {};
    let max = 0;
    data.forEach((d) => {
      const iso3 = iso2to3[d._id] || d._id;
      map[iso3] = d.count;
      if (d.count > max) max = d.count;
    });
    return { countryMap: map, maxCount: max };
  }, [data]);

  const getColor = (iso3: string) => {
    const count = countryMap[iso3];
    if (!count) return "hsl(220, 15%, 13%)";
    const ratio = count / (maxCount || 1);
    // 5-stop gradient: faint → light → medium → bright → vivid
    if (ratio <= 0.2) return "hsl(199, 60%, 22%)";
    if (ratio <= 0.4) return "hsl(199, 70%, 32%)";
    if (ratio <= 0.6) return "hsl(199, 80%, 42%)";
    if (ratio <= 0.8) return "hsl(199, 85%, 52%)";
    return "hsl(199, 90%, 60%)";
  };

  return (
    <div className="glass-card p-5 col-span-full fade-in stagger-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Clicks by Country
      </h3>
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        <ComposableMap
          projectionConfig={{ scale: 147, center: [0, 20] }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso3 = geo.properties?.ISO_A3 || geo.id;
                  const count = countryMap[iso3] || 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(iso3)}
                      stroke="hsl(228, 12%, 22%)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: count ? "hsl(199, 89%, 58%)" : "hsl(228, 12%, 22%)",
                          outline: "none",
                          cursor: count ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {data.slice(0, 8).map((d) => (
          <div key={d._id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: getColor(iso2to3[d._id] || d._id) }}
            />
            <span className="text-foreground font-medium">{d._id}</span>
            <span>({d.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
