'use client';

import { Calendar, DollarSign, Film, Building2, Monitor, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShowtimeForm } from '../hooks/useShowtimeForm';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { format } from 'date-fns';

export function ShowtimeManager() {
  const { 
    formData, 
    selectedTheaterId, 
    setSelectedTheaterId, 
    handleChange, 
    handleSubmit, 
    isSubmitting, 
    movies, 
    theaters, 
    screens, 
    isLoadingMovies, 
    isLoadingTheaters,
    isLoadingScreens,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  } = useShowtimeForm();

  const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ['showtimes', selectedTheaterId],
    queryFn: () => adminApi.getShowtimesByTheater(selectedTheaterId),
    enabled: !!selectedTheaterId,
  });

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Showtime' : 'Schedule New Showtime'}
          </h2>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4 mr-2" /> Cancel Edit
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <Label htmlFor="movieId" className="flex items-center gap-2 text-zinc-400">
              <Film className="w-4 h-4" /> Select Movie
            </Label>
            <select 
              id="movieId" 
              name="movieId" 
              value={formData.movieId} 
              onChange={handleChange} 
              required 
              className="w-full h-10 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="" disabled>
                {isLoadingMovies ? 'Loading movies...' : '-- Select a movie --'}
              </option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theaterId" className="flex items-center gap-2 text-zinc-400">
              <Building2 className="w-4 h-4" /> Select Theater
            </Label>
            <select 
              id="theaterId" 
              name="theaterId" 
              value={selectedTheaterId} 
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              disabled={isEditing}
              className="w-full h-10 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <option value="" disabled>
                {isLoadingTheaters ? 'Loading theaters...' : '-- Select a theater --'}
              </option>
              {theaters.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenId" className="flex items-center gap-2 text-zinc-400">
              <Monitor className="w-4 h-4" /> Select Screen
            </Label>
            <select 
              id="screenId" 
              name="screenId" 
              value={formData.screenId} 
              onChange={handleChange} 
              required 
              disabled={!selectedTheaterId}
              className="w-full h-10 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <option value="" disabled>
                {!selectedTheaterId ? 'Select theater first' : isLoadingScreens ? 'Loading screens...' : '-- Select a screen --'}
              </option>
              {screens.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Cap: {s.capacity})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4" /> Date & Time
              </Label>
              <Input 
                id="startTime" 
                name="startTime" 
                type="datetime-local" 
                value={formData.startTime} 
                onChange={handleChange} 
                required 
                className="bg-zinc-900/50 border-zinc-800" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2 text-zinc-400">
                <DollarSign className="w-4 h-4" /> Ticket Price ($)
              </Label>
              <Input 
                id="price" 
                name="price" 
                type="number"
                step="0.01" 
                placeholder="e.g., 15.00" 
                value={formData.price || ''} 
                onChange={handleChange} 
                required 
                className="bg-zinc-900/50 border-zinc-800" 
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full font-bold h-12 mt-4 text-white ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Scheduling...') : (isEditing ? 'Update Showtime' : 'Schedule Showtime')}
          </Button>
        </form>
      </div>

      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Existing Showtimes</h2>
        
        {!selectedTheaterId ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            Select a theater to view its showtimes
          </div>
        ) : isLoadingShowtimes ? (
          <div className="text-center py-8 text-zinc-400">Loading showtimes...</div>
        ) : showtimes?.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            No showtimes found for this theater
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Movie</th>
                  <th className="pb-3 px-4 font-medium">Screen</th>
                  <th className="pb-3 px-4 font-medium">Time</th>
                  <th className="pb-3 px-4 font-medium">Price</th>
                  <th className="pb-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {showtimes?.map((showtime) => (
                  <tr key={showtime.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-zinc-200">{showtime.movieTitle}</td>
                    <td className="py-4 px-4 text-zinc-400">{showtime.screenName}</td>
                    <td className="py-4 px-4 text-zinc-400">
                      {format(new Date(showtime.startTime), 'MMM d, h:mm a')}
                    </td>
                    <td className="py-4 px-4 text-zinc-400">${showtime.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-blue-500/20 hover:text-blue-400"
                        onClick={() => startEdit(showtime)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => handleDelete(showtime.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
