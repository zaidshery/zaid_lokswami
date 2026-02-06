import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/workflow/StatusBadge';
import { StatusChanger } from '@/components/workflow/StatusChanger';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { articlesAPI, categoriesAPI } from '@/services/api';
import { Article, ArticleStatus, Category, AIOutput } from '@/types';
import { toast } from 'sonner';

export function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<ArticleStatus>(ArticleStatus.DRAFT);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await articlesAPI.getArticleById(id);
      const article = response.data.article;
      
      setTitle(article.title);
      setContent(article.content);
      setSummary(article.summary || []);
      setTags(article.tags || []);
      setSeoTitle(article.seo?.title || '');
      setSeoDescription(article.seo?.metaDescription || '');
      setSeoKeywords(article.seo?.keywords || []);
      setCategory(article.category?._id || '');
      setFeaturedImage(article.featuredImage || '');
      setStatus(article.status);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('लेख लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (newStatus?: ArticleStatus) => {
    if (!title || !content || !category) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    try {
      setSaving(true);
      
      const articleData = {
        title,
        content,
        summary,
        tags,
        seo: {
          title: seoTitle,
          metaDescription: seoDescription,
          keywords: seoKeywords
        },
        category,
        featuredImage: featuredImage || 'https://via.placeholder.com/800x450',
        status: newStatus || status
      };

      if (isEditing) {
        await articlesAPI.updateArticle(id!, articleData);
        toast.success('लेख अपडेट हो गया');
      } else {
        const response = await articlesAPI.createArticle(articleData);
        toast.success('लेख बनाया गया');
        navigate(`/articles/edit/${response.data.article._id}`);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('लेख सेव करने में विफल');
    } finally {
      setSaving(false);
    }
  };

  const handleAIApply = (data: Partial<AIOutput>) => {
    if (data.summary) setSummary(data.summary);
    if (data.tags) setTags(data.tags);
    if (data.seo) {
      setSeoTitle(data.seo.title);
      setSeoDescription(data.seo.metaDescription);
      setSeoKeywords(data.seo.keywords);
    }
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    if (!isEditing) {
      setStatus(newStatus);
      return;
    }
    
    try {
      await articlesAPI.updateArticle(id!, { status: newStatus });
      setStatus(newStatus);
      toast.success(`स्थिति बदलकर ${newStatus} हो गई`);
    } catch (error) {
      console.error('Failed to change status:', error);
      toast.error('स्थिति बदलने में विफल');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/articles')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-hindi">
              {isEditing ? 'लेख संपादित करें' : 'नया लेख'}
            </h1>
            {isEditing && <StatusBadge status={status} className="mt-1" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusChanger currentStatus={status} onChange={handleStatusChange} />
          <Button onClick={() => handleSave()} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            सेव करें
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">शीर्षक *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="लेख का शीर्षक"
              className="font-hindi text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">सामग्री *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="लेख की सामग्री..."
              className="min-h-[400px] font-hindi"
            />
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-hindi">सारांश</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {summary.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => {
                      const newSummary = [...summary];
                      newSummary[index] = e.target.value;
                      setSummary(newSummary);
                    }}
                    placeholder={`बिंदु ${index + 1}`}
                    className="font-hindi"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSummary(summary.filter((_, i) => i !== index));
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setSummary([...summary, ''])}
                className="w-full"
              >
                + बिंदु जोड़ें
              </Button>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-hindi">SEO सेटिंग्स</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO शीर्षक</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="50-60 अक्षरों का शीर्षक"
                  className="font-hindi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">मेटा विवरण</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="150-160 अक्षरों का विवरण"
                  className="font-hindi"
                />
              </div>
              <div className="space-y-2">
                <Label>कीवर्ड्स</Label>
                <div className="flex flex-wrap gap-2">
                  {seoKeywords.map((kw, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted rounded text-sm flex items-center gap-1"
                    >
                      {kw}
                      <button
                        onClick={() => setSeoKeywords(seoKeywords.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <Input
                    placeholder="कीवर्ड जोड़ें"
                    className="w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim();
                        if (value && !seoKeywords.includes(value)) {
                          setSeoKeywords([...seoKeywords, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AIAssistant
            title={title}
            content={content}
            onApply={handleAIApply}
          />

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-hindi">श्रेणी</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="श्रेणी चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-hindi">फीचर्ड इमेज</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full aspect-video object-cover rounded-lg"
                />
              )}
              <Input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="इमेज URL"
              />
              <Button variant="outline" className="w-full gap-2">
                <ImageIcon className="w-4 h-4" />
                इमेज अपलोड करें
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-hindi">टैग्स</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-maroon/10 text-maroon rounded text-sm flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="hover:text-maroon-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="टैग जोड़ें और Enter दबाएं"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value.trim();
                    if (value && !tags.includes(value)) {
                      setTags([...tags, value]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="font-hindi"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}