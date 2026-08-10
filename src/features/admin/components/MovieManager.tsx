'use client';

import { useState, useMemo } from 'react';
import { Search, Type, Clock, Calendar, Image as ImageIcon, Sparkles, Edit2, Trash2, X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMovieForm } from '@/features/admin/hooks/useMovieForm';
import { PosterPreview } from '@/features/admin/components/PosterPreview';
import { GENRES } from '@/features/movies/components/FilterBar';

export function MovieManager() {
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    isSubmitting,
    formData,
    handleSearchTMDB,
    handleChange,
    handleSubmit,
    movies,
    isLoadingMovies,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  } = useMovieForm();

  const [adminFilter, setAdminFilter] = useState('All');

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    if (adminFilter === 'All') return movies;
    return movies.filter((m: any) => m.genre && m.genre.toLowerCase().includes(adminFilter.toLowerCase()));
  }, [movies, adminFilter]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* OMDB Auto-fill Section */}
          {!isEditing && (
            <div className="bg-zinc-900/50 border border-border/50 p-6 rounded-2xl backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                OMDB Auto-Fill
              </h2>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                    placeholder="Search OMDB by movie title (try: dune, oppenheimer)..." 
                    className="pl-10 bg-black/50 border-zinc-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTMDB()}
                  />
                </div>
                <Button 
                  onClick={handleSearchTMDB} 
                  disabled={isSearching || !searchQuery}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isSearching ? 'Searching...' : 'Auto-Fill'}
                </Button>
              </div>
            </div>
          )}

          {/* Add/Edit Movie Form */}
          <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4 mr-2" /> Cancel Edit
                </Button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2 text-zinc-400"><Type className="w-4 h-4" /> Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-400">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  className="bg-zinc-900/50 border-zinc-800 min-h-[120px]" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-zinc-400">Genre</Label>
                  <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-zinc-400">Language</Label>
                  <Input id="language" name="language" value={formData.language} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes" className="flex items-center gap-2 text-zinc-400"><Clock className="w-4 h-4" /> Duration (mins)</Label>
                  <Input id="durationMinutes" name="durationMinutes" type="number" value={formData.durationMinutes} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseDate" className="flex items-center gap-2 text-zinc-400"><Calendar className="w-4 h-4" /> Release Date</Label>
                  <Input id="releaseDate" name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="posterUrl" className="flex items-center gap-2 text-zinc-400"><ImageIcon className="w-4 h-4" /> Poster URL</Label>
                <Input id="posterUrl" name="posterUrl" type="url" value={formData.posterUrl} onChange={handleChange} required className="bg-zinc-900/50 border-zinc-800" />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold h-12 mt-4 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {isSubmitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Movie' : 'Publish Movie')}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Contextual Sidebar for Preview */}
        <div className="lg:col-span-1 space-y-6">
          <PosterPreview 
            title={formData.title}
            posterUrl={formData.posterUrl}
            language={formData.language}
            durationMinutes={formData.durationMinutes}
          />
        </div>
      </div>

      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Existing Movies</h2>
          <div className="flex flex-wrap gap-2 pb-2 max-w-full md:max-w-[60%] lg:max-w-2xl">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setAdminFilter(genre)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors shrink-0 ${adminFilter === genre ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        {isLoadingMovies ? (
          <div className="text-center py-8 text-zinc-400">Loading movies...</div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            No movies found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie: any) => (
              <div key={movie.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-3">
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden border border-zinc-800 bg-black">
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <Film className="h-8 w-8 text-zinc-700 mb-2" />
                      <span className="text-sm font-medium text-zinc-500 line-clamp-2">{movie.title}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white line-clamp-1" title={movie.title}>{movie.title}</h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {movie.durationMinutes} min • {movie.language}
                  </p>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-red-500/80 mt-2">
                    {movie.genre || 'Uncategorized'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 w-full overflow-hidden">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-zinc-900/50 border-zinc-700 hover:bg-blue-500/20 hover:text-blue-400 min-w-0 px-2"
                    onClick={() => {
                      startEdit(movie);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1 md:mr-1.5 shrink-0" /> <span className="truncate">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-zinc-900/50 border-zinc-700 hover:bg-red-500/20 hover:text-red-400 min-w-0 px-2"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1 md:mr-1.5 shrink-0" /> <span className="truncate">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
