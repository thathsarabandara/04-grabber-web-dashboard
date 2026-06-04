import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Search, ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '../../utils/blogData';

export function BlogPage() {
  const contentRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.slice(0, 5);
  const remainingPosts = filteredPosts;

  // Carousel Logic
  useEffect(() => {
    if (featuredPosts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [activeCategory, searchQuery]);

  return (
    <div ref={contentRef} className="space-y-20 pb-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      
      {/* Search & Categories Bar (Minimalist) */}
      <div data-animate className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 relative z-10 border-b border-slate-200 pb-10">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-none">Journal.</h1>
          <p className="text-slate-500 text-lg font-medium">Hardware insights, architecture decisions, and engineering deep dives.</p>
        </div>
        
        <div className="flex flex-col gap-6 w-full lg:max-w-md">
          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the archives..." 
              className="w-full pl-8 pr-0 py-2 bg-transparent border-b border-slate-200 outline-none focus:border-slate-900 transition-all text-base placeholder:text-slate-400 font-bold"
            />
          </div>
          <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap pb-2 border-b-2 ${
                  activeCategory === cat 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-slate-400 font-bold text-lg">No entries found matching your criteria.</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
            className="mt-6 text-slate-900 font-black text-xs uppercase tracking-widest hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Big Highlight Slider (Minimalist Hero) */}
          {featuredPosts.length > 0 && (
            <section data-animate className="relative z-10">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-[16/9] lg:aspect-[21/9]">
                {featuredPosts.map((post, idx) => (
                  <div 
                    key={post.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      idx === currentSlideIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block w-full h-full">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 flex flex-col justify-end">
                        <div className="mb-8 flex items-center gap-6">
                          <span className="px-5 py-2 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                            Featured
                          </span>
                          <span className="text-white/80 text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                             <Calendar size={14} /> {post.date}
                          </span>
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] max-w-4xl mb-8">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em]">
                          Read Story <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                
                {/* Carousel Indicators */}
                {featuredPosts.length > 1 && (
                  <div className="absolute bottom-10 right-10 flex gap-3 z-20">
                    {featuredPosts.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${
                          idx === currentSlideIndex ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Minimalist Eye-Catching Grid */}
          {remainingPosts.length > 0 && (
            <section data-animate className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 relative z-10 pt-10">
              {remainingPosts.map((post) => (
                <article key={post.id} className="group flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden rounded-3xl aspect-[4/3] mb-8 bg-slate-100 shadow-sm">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{post.category}</span>
                      <span className="text-[10px] font-bold text-slate-400">{post.readTime} read</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-2xl font-black text-slate-900 leading-[1.2] tracking-tight group-hover:text-slate-500 transition-colors mb-4">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="mt-auto inline-flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]"
                    >
                      Read More
                      <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {/* Minimalist Newsletter */}
      <section data-animate className="mt-32 pt-20 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Stay in the loop.</h3>
            <p className="text-slate-500 text-lg font-medium">Subscribe to get our latest architectural overviews and hardware teardowns.</p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex items-center border-b-2 border-slate-900 pb-2 group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-bold text-lg"
              />
              <button className="text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-500 transition-colors pl-4">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
