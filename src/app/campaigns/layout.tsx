import { RouteGuard } from '../../components/RouteGuard';

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard>{children}</RouteGuard>;
}
