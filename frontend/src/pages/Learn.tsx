import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search, ExternalLink, Clock, Star } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface ResourceItem {
  title: string;
  summary: string;
  url: string;
  reading_time_minutes: number;
  topic: string;
  trust_score: number;
}

export default function Learn() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { name: "Menstrual Health Basics", value: "menstrual-health", color: "bg-pink-100 text-pink-700" },
    { name: "PMS & Pain Management", value: "pms-pain", color: "bg-purple-100 text-purple-700" },
    { name: "Nutrition & Cycle", value: "nutrition", color: "bg-green-100 text-green-700" },
    { name: "Exercise & Movement", value: "exercise", color: "bg-blue-100 text-blue-700" },
    { name: "Emotional Wellness", value: "emotional", color: "bg-yellow-100 text-yellow-700" },
    { name: "Product Options", value: "products", color: "bg-indigo-100 text-indigo-700" },
  ];

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async (topic?: string) => {
    setLoading(true);
    try {
      const response = await api.getResources(topic);
      // Handle different response structures
      if (response.resources && Array.isArray(response.resources)) {
        setResources(response.resources);
      } else {
        // Mock data when no backend resources are available
        const mockResources = [
          {
            title: "Understanding Your Menstrual Cycle",
            summary: "Learn about the four phases of your cycle and what happens in your body during each phase.",
            url: "https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186",
            reading_time_minutes: 5,
            topic: "menstrual-health",
            trust_score: 9
          },
          {
            title: "Managing Period Pain Naturally",
            summary: "Evidence-based natural remedies for menstrual cramps including heat therapy, exercise, and dietary changes.",
            url: "https://www.healthline.com/health/womens-health/menstrual-cramp-remedies",
            reading_time_minutes: 7,
            topic: "pms-pain",
            trust_score: 8
          },
          {
            title: "Nutrition During Your Cycle",
            summary: "How to eat to support your energy and mood throughout your menstrual cycle phases.",
            url: "https://www.webmd.com/women/features/nutrition-menstrual-cycle",
            reading_time_minutes: 6,
            topic: "nutrition",
            trust_score: 8
          },
          {
            title: "Exercise and Your Period",
            summary: "Safe and effective workouts for different phases of your cycle, plus when to rest.",
            url: "https://www.nike.com/a/training-on-your-period",
            reading_time_minutes: 4,
            topic: "exercise",
            trust_score: 7
          },
          {
            title: "Period Product Options Guide",
            summary: "Comprehensive comparison of pads, tampons, cups, and other menstrual products.",
            url: "https://www.plannedparenthood.org/learn/health-and-wellness/menstruation/what-are-different-types-period-products",
            reading_time_minutes: 8,
            topic: "products",
            trust_score: 9
          }
        ];
        
        // Filter by topic if specified
        if (topic) {
          const filtered = mockResources.filter(r => 
            r.topic.toLowerCase().includes(topic.toLowerCase()) ||
            r.title.toLowerCase().includes(topic.toLowerCase()) ||
            r.summary.toLowerCase().includes(topic.toLowerCase())
          );
          setResources(filtered);
        } else {
          setResources(mockResources);
        }
      }
    } catch (error) {
      console.error("Failed to load resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    loadResources(topic);
  };

  const handleSearch = () => {
    if (searchTopic.trim()) {
      loadResources(searchTopic.trim());
      setSelectedTopic(searchTopic.trim());
    } else {
      loadResources();
      setSelectedTopic(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Learn & Resources</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-glow/30 text-center">
            <div className="space-y-4">
              <BookOpen className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Menstrual Health Library</h2>
              <p className="text-muted-foreground">Evidence-based articles and resources to support your wellness journey</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for specific topics..."
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 rounded-full"
                />
              </div>
              <Button onClick={handleSearch} className="rounded-full">
                Search
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Topic Categories */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg font-semibold mb-4">Browse Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic, index) => (
              <button
                key={topic.value}
                onClick={() => handleTopicClick(topic.value)}
                className={`p-4 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                  selectedTopic === topic.value 
                    ? 'ring-2 ring-primary ' + topic.color 
                    : topic.color + ' hover:opacity-80'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clear Filter */}
        {selectedTopic && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing results for: <span className="font-medium">{selectedTopic}</span>
              </p>
              <Button variant="outline" size="sm" onClick={() => { setSelectedTopic(null); loadResources(); }}>
                Show All
              </Button>
            </div>
          </motion.div>
        )}

        {/* Resources List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <GlassCard className="text-center py-8">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto opacity-50 mb-4" />
              <h4 className="text-lg font-semibold text-muted-foreground mb-2">No Resources Found</h4>
              <p className="text-sm text-muted-foreground">
                {selectedTopic ? "Try a different topic or search term" : "Resources are being loaded"}
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="hover:bg-white/10 transition-all cursor-pointer" onClick={() => window.open(resource.url, '_blank')}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-semibold flex-1">{resource.title}</h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {resource.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{resource.reading_time_minutes} min read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>Trust score: {resource.trust_score}/10</span>
                          </div>
                        </div>
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                          {resource.topic}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Educational Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="border-l-4 border-primary">
            <h4 className="font-semibold mb-3">💡 Did You Know?</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Cycle Length Varies</p>
                <p>Normal cycles can range from 21-35 days, and it's normal for your cycle to vary by a few days each month.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Hydration Helps</p>
                <p>Staying well-hydrated can help reduce period pain and bloating. Aim for 8-10 glasses of water daily.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}