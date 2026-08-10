'use client';

import { Monitor, Users, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useScreenForm } from '../hooks/useScreenForm';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function ScreenManager() {
  const { 
    formData, 
    handleChange, 
    handleSubmit, 
    isSubmitting, 
    theaters, 
    isLoadingTheaters,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  } = useScreenForm();

  const { data: screens, isLoading: isLoadingScreens } = useQuery({
    queryKey: ['screens', formData.theaterId],
    queryFn: () => adminApi.getScreensByTheater(formData.theaterId),
    enabled: !!formData.theaterId,
  });

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Screen' : 'Add New Screen'}
          </h2>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4 mr-2" /> Cancel Edit
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="theaterId" className="text-zinc-400">Select Theater</Label>
            <select 
              id="theaterId" 
              name="theaterId" 
              value={formData.theaterId} 
              onChange={handleChange} 
              required 
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-zinc-400">
                <Monitor className="w-4 h-4" /> Screen Name
              </Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., Screen 1 (IMAX)" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="bg-zinc-900/50 border-zinc-800" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity" className="flex items-center gap-2 text-zinc-400">
                <Users className="w-4 h-4" /> Seating Capacity
              </Label>
              <Input 
                id="capacity" 
                name="capacity" 
                type="number"
                placeholder="e.g., 150" 
                value={formData.capacity || ''} 
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
            {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Screen' : 'Add Screen')}
          </Button>
        </form>
      </div>

      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Existing Screens</h2>
        
        {!formData.theaterId ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            Select a theater to view its screens
          </div>
        ) : isLoadingScreens ? (
          <div className="text-center py-8 text-zinc-400">Loading screens...</div>
        ) : screens?.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            No screens found for this theater
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Name</th>
                  <th className="pb-3 px-4 font-medium">Capacity</th>
                  <th className="pb-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {screens?.map((screen) => (
                  <tr key={screen.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-zinc-200">{screen.name}</td>
                    <td className="py-4 px-4 text-zinc-400">{screen.capacity}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-blue-500/20 hover:text-blue-400"
                        onClick={() => startEdit(screen)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => handleDelete(screen.id!)}
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
