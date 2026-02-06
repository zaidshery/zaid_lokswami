import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { StatusBadge } from '@/components/workflow/StatusBadge';
import { articlesAPI } from '@/services/api';
import { Article, ArticleStatus } from '@/types';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'all', label: 'सभी स्थिति' },
  { value: ArticleStatus.DRAFT, label: 'ड्राफ्ट' },
  { value: ArticleStatus.SUB_EDITOR_REVIEW, label: 'सब-एडिटर रिव्यू' },
  { value: ArticleStatus.EDITOR_APPROVED, label: 'एडिटर अप्रूव्ड' },
  { value: ArticleStatus.PUBLISHED, label: 'प्रकाशित' },
  { value: ArticleStatus.ARCHIVED, label: 'अभिलेखित' },
];

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getArticles({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 50
      });
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('लेख लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await articlesAPI.deleteArticle(deleteId);
      toast.success('लेख हटा दिया गया');
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('लेख हटाने में विफल');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-hindi">लेख</h1>
          <p className="text-muted-foreground">
            सभी समाचार लेख प्रबंधित करें
          </p>
        </div>
        <Link to="/articles/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            नया लेख
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="लेख खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="divide-y">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-5">शीर्षक</div>
                <div className="col-span-2">श्रेणी</div>
                <div className="col-span-2">स्थिति</div>
                <div className="col-span-2">तारीख</div>
                <div className="col-span-1">कार्रवाई</div>
              </div>

              {/* Table Rows */}
              {filteredArticles.map((article) => (
                <div
                  key={article._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-1 md:col-span-5">
                    <Link
                      to={`/articles/edit/${article._id}`}
                      className="font-medium font-hindi hover:text-maroon transition-colors line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="md:hidden mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <StatusBadge status={article.status} />
                      <span>{article.category?.name}</span>
                    </div>
                  </div>
                  <div className="hidden md:block col-span-2 text-sm">
                    {article.category?.name}
                  </div>
                  <div className="hidden md:block col-span-2">
                    <StatusBadge status={article.status} />
                  </div>
                  <div className="hidden md:block col-span-2 text-sm text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString('hi-IN')}
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    <Link to={`/articles/edit/${article._id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <a href={`/${article.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(article._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-hindi">
                कोई लेख नहीं मिला
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-hindi">क्या आप निश्चित हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह कार्रवाई अपरिवर्तनीय है। यह लेख स्थायी रूप से हटा देगा।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}