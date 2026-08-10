import { MovieDetailPage } from '@/features/movies/components/MovieDetailPage';

export const dynamic = 'force-dynamic';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: MoviePageProps) {
  return <MovieDetailPage params={params} />;
}
