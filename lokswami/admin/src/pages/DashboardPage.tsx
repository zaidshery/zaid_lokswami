import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/workflow/StatusBadge';
import { articlesAPI } from '@/services/api';
import { Article, DashboardStats } from '@/types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch articles for stats
        const articlesRes = await articlesAPI.getArticles({ limit: 100 });
        const articles = articlesRes.data.articles;
        
        const totalArticles = articles.length;
        const publishedArticles = articles.filter(a => a.status === 'PUBLISHED').length;
        const draftArticles = articles.filter(a => a.status === 'DRAFT').length;
        const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
        
        setStats({
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews,
          recentArticles: articles.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'कुल लेख',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'प्रकाशित',
      value: stats?.publishedArticles || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'ड्राफ्ट',
      value: stats?.draftArticles || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'कुल व्यूज',
      value: stats?.totalViews?.toLocaleString('hi-IN') || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-hindi">डैशबोर्ड</h1>
        <p className="text-muted-foreground">
          आपकी वेबसाइट का अवलोकन
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-hindi">{stat.title}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-hindi flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            हाल के लेख
          </CardTitle>
          <Link to="/articles">
            <Button variant="ghost" size="sm" className="gap-1">
              सभी देखें
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : stats?.recentArticles.length ? (
            <div className="divide-y">
              {stats.recentArticles.map((article) => (
                <div
                  key={article._id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link
                      to={`/articles/edit/${article._id}`}
                      className="font-medium font-hindi hover:text-maroon transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <StatusBadge status={article.status} />
                      <span>{new Date(article.createdAt).toLocaleDateString('hi-IN')}</span>
                      <span>•</span>
                      <span>{article.viewCount?.toLocaleString('hi-IN')} व्यूज</span>
                    </div>
                  </div>
                  <Link to={`/articles/edit/${article._id}`}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground font-hindi">
              कोई लेख उपलब्ध नहीं
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold font-hindi mb-2">नया लेख लिखें</h3>
            <p className="text-sm text-muted-foreground mb-4">
              एक नया समाचार लेख बनाएं और AI सहायक का उपयोग करें
            </p>
            <Link to="/articles/new">
              <Button className="w-full gap-2">
                <FileText className="w-4 h-4" />
                नया लेख
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold font-hindi mb-2">मीडिया प्रबंधन</h3>
            <p className="text-sm text-muted-foreground mb-4">
              छवियां और PDF अपलोड करें और प्रबंधित करें
            </p>
            <Link to="/media">
              <Button variant="outline" className="w-full gap-2">
                <TrendingUp className="w-4 h-4" />
                मीडिया देखें
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}