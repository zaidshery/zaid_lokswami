import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { categoriesAPI } from '@/services/api';
import { Category } from '@/types';
import { toast } from 'sonner';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8B0000');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('श्रेणियाँ लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description);
      setColor(category.color);
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setColor('#8B0000');
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name || !slug) {
      toast.error('नाम और स्लग आवश्यक हैं');
      return;
    }

    try {
      const data = { name, slug, description, color };
      
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory._id, data);
        toast.success('श्रेणी अपडेट हो गई');
      } else {
        await categoriesAPI.createCategory(data);
        toast.success('श्रेणी बनाई गई');
      }
      
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('श्रेणी सेव करने में विफल');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await categoriesAPI.deleteCategory(deleteId);
      toast.success('श्रेणी हटा दी गई');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('श्रेणी हटाने में विफल');
    } finally {
      setDeleteId(null);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-hindi">श्रेणियाँ</h1>
          <p className="text-muted-foreground">
            समाचार श्रेणियाँ प्रबंधित करें
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          नई श्रेणी
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h3 className="font-bold font-hindi">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.articleCount} लेख
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(category._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {category.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-hindi">
              {editingCategory ? 'श्रेणी संपादित करें' : 'नई श्रेणी'}
            </DialogTitle>
            <DialogDescription>
              श्रेणी की जानकारी भरें
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>नाम *</Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="श्रेणी का नाम"
                className="font-hindi"
              />
            </div>
            
            <div className="space-y-2">
              <Label>स्लग *</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
              />
            </div>
            
            <div className="space-y-2">
              <Label>विवरण</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="श्रेणी का विवरण"
                className="font-hindi"
              />
            </div>
            
            <div className="space-y-2">
              <Label>रंग</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#8B0000"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              रद्द करें
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'अपडेट करें' : 'बनाएं'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-hindi">क्या आप निश्चित हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह श्रेणी स्थायी रूप से हटा दी जाएगी। इसमें मौजूद लेख प्रभावित नहीं होंगे।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}