'use client';

import { Building2, MapPin, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheaterForm } from '../hooks/useTheaterForm';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function TheaterManager() {
  const { 
    formData, 
    handleChange, 
    handleSubmit, 
    isSubmitting,
    isEditing,
    cancelEdit,
    startEdit,
    handleDelete
  } = useTheaterForm();

  const { data: theaters, isLoading } = useQuery({
    queryKey: ['theaters'],
    queryFn: adminApi.getTheaters
  });

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Theater' : 'Add New Theater'}
          </h2>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4 mr-2" /> Cancel Edit
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-zinc-400">
                <Building2 className="w-4 h-4" /> Theater Name
              </Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., PVR Phoenix Mall" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="bg-zinc-900/50 border-zinc-800" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-400">City</Label>
              <Input 
                id="city" 
                name="city" 
                placeholder="e.g., Mumbai" 
                value={formData.city} 
                onChange={handleChange} 
                required 
                className="bg-zinc-900/50 border-zinc-800" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-4 h-4" /> Full Address
            </Label>
            <Input 
              id="address" 
              name="address" 
              placeholder="e.g., Level 2, Phoenix Marketcity" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              className="bg-zinc-900/50 border-zinc-800" 
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full font-bold h-12 mt-4 text-white ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Theater' : 'Add Theater')}
          </Button>
        </form>
      </div>

      <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Existing Theaters</h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-zinc-400">Loading theaters...</div>
        ) : theaters?.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            No theaters found. Add your first theater above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Name</th>
                  <th className="pb-3 px-4 font-medium">City</th>
                  <th className="pb-3 px-4 font-medium">Address</th>
                  <th className="pb-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {theaters?.map((theater) => (
                  <tr key={theater.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-zinc-200">{theater.name}</td>
                    <td className="py-4 px-4 text-zinc-400">{theater.city}</td>
                    <td className="py-4 px-4 text-zinc-400 max-w-[200px] truncate">{theater.address}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-blue-500/20 hover:text-blue-400"
                        onClick={() => startEdit(theater)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-zinc-900/50 border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => handleDelete(theater.id!)}
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
