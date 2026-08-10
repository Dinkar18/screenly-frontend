import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { moviesApi } from '@/features/movies/api/movies';
import axios from 'axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export function useMovieForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    durationMinutes: '',
    releaseDate: '',
    language: '',
    posterUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: moviesData, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['movies'],
    queryFn: () => moviesApi.getAllMovies(0, 100) // load more for admin
  });

  const movies = moviesData?.content || [];

  const handleSearchTMDB = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
      if (!apiKey) {
        toast('OMDB API key is missing. Please configure it in .env.local', 'error');
        return;
      }
      const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`);
      
      if (data.Response === 'True') {
        let duration = '120';
        if (data.Runtime && data.Runtime !== 'N/A') {
          duration = data.Runtime.split(' ')[0];
        }

        let releaseDateStr = '';
        if (data.Released && data.Released !== 'N/A') {
          const d = new Date(data.Released);
          if (!isNaN(d.getTime())) {
            releaseDateStr = d.toISOString().split('T')[0];
          }
        }

        setFormData({
          title: data.Title || '',
          description: data.Plot !== 'N/A' ? data.Plot : '',
          genre: data.Genre !== 'N/A' ? data.Genre.split(',')[0] : '',
          durationMinutes: duration,
          releaseDate: releaseDateStr,
          language: data.Language !== 'N/A' ? data.Language.split(',')[0] : '',
          posterUrl: data.Poster !== 'N/A' ? data.Poster : ''
        });
        toast('OMDB Data auto-filled successfully!', 'success');
      } else {
        toast(`Movie not found in OMDB: ${data.Error}`, 'error');
      }
    } catch (error) {
      toast('Failed to fetch from OMDB API', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        durationMinutes: parseInt(formData.durationMinutes),
        releaseDate: new Date(formData.releaseDate).toISOString(),
        language: formData.language,
        posterUrl: formData.posterUrl
      };
      
      if (isEditing && editingId) {
        await moviesApi.updateMovie(editingId, payload);
        toast('Movie updated successfully!', 'success');
        cancelEdit();
      } else {
        await moviesApi.addMovie(payload);
        toast('Movie successfully published to CMS!', 'success');
        setFormData({
          title: '',
          description: '',
          genre: '',
          durationMinutes: '',
          releaseDate: '',
          language: '',
          posterUrl: ''
        });
        setSearchQuery('');
      }
      
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      
    } catch (error) {
      toast(isEditing ? 'Failed to update movie.' : 'Failed to add movie.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (movie: any) => {
    setIsEditing(true);
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      durationMinutes: movie.durationMinutes.toString(),
      releaseDate: movie.releaseDate.split('T')[0],
      language: movie.language,
      posterUrl: movie.posterUrl
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      genre: '',
      durationMinutes: '',
      releaseDate: '',
      language: '',
      posterUrl: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await moviesApi.deleteMovie(id);
        toast('Movie deleted successfully!', 'success');
        queryClient.invalidateQueries({ queryKey: ['movies'] });
      } catch (error) {
        toast('Failed to delete movie.', 'error');
      }
    }
  };

  return {
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
  };
}
