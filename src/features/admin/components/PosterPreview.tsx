import { Image as ImageIcon } from 'lucide-react';

interface PosterPreviewProps {
  title: string;
  posterUrl: string;
  language: string;
  durationMinutes: string;
}

export function PosterPreview({ title, posterUrl, language, durationMinutes }: PosterPreviewProps) {
  return (
    <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl sticky top-24">
      <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Poster Preview</h2>
      <div className="w-full aspect-[2/3] bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative shadow-2xl">
        {posterUrl ? (
          <img src={posterUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <span className="text-sm font-medium">No Poster URL</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-2">
        <h3 className="font-bold text-lg text-white leading-tight truncate">
          {title || 'Movie Title'}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="uppercase tracking-wider">{language || 'LANG'}</span>
          <span>•</span>
          <span>{durationMinutes ? `${durationMinutes} mins` : 'Duration'}</span>
        </div>
      </div>
    </div>
  );
}
