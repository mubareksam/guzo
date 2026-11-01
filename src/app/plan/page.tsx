import PlanClient from "@/app/components/PlanClient";
import { getNetwork, getPopularDestinations } from "@/lib/data";
import { resolvePlaceQuery } from "@/lib/geocode";

export const dynamic = "force-dynamic";

type Params = { from?: string; to?: string; fromLat?: string; fromLng?: string; toLat?: string; toLng?: string; station?: string };

export default async function PlanPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const [network, popular] = await Promise.all([getNetwork(), getPopularDestinations(10)]);

  const point = async (label?: string, lat?: string, lng?: string) => {
    const la = Number(lat);
    const ln = Number(lng);
    if (label && Number.isFinite(la) && Number.isFinite(ln) && lat && lng) return { label, lat: la, lng: ln, source: "search" as const };
    if (label) {
      const hit = await resolvePlaceQuery(label, network.raw);
      if (hit) return { label: hit.label, lat: hit.lat, lng: hit.lng, source: "search" as const };
    }
    return null;
  };

  let initialFrom = await point(params.from, params.fromLat, params.fromLng);
  if (!initialFrom && params.station) {
    const st = network.stations.find((s) => s.id === Number(params.station));
    if (st) initialFrom = { label: st.name, lat: st.lat, lng: st.lng, source: "search" as const };
  }
  const initialTo = await point(params.to, params.toLat, params.toLng);

  return (
    <PlanClient
      stations={network.stations.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng, kind: s.kind, area: s.area, landmark: s.landmark }))}
      initialFrom={initialFrom}
      initialTo={initialTo}
      popular={popular.map((p) => ({ label: p.label, lat: p.lat, lng: p.lng }))}
    />
  );
}
