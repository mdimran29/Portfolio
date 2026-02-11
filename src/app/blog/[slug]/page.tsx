import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import './styles.css';

// Blog metadata
const blogPosts = {
  'building-production-defi-petition-io': {
    title: 'Building Production DeFi: Lessons from Petition.io',
    description: 'Deep dive into architecting a zero-principal-risk donation protocol with Rocket Pool and Uniswap V3 integration.',
    date: 'February 2026',
    readTime: '15 min read',
    category: 'DeFi Architecture',
    emoji: '🏗️',
  },
  'smart-contract-testing-patterns-foundry': {
    title: 'Smart Contract Security: Testing Patterns with Foundry',
    description: 'Comprehensive guide to unit, fuzz, and invariant testing strategies for bulletproof smart contracts.',
    date: 'February 2026',
    readTime: '17 min read',
    category: 'Security',
    emoji: '🛡️',
  },
  'learning-in-public-web3-journey': {
    title: 'Learning in Public: My Web3 Journey',
    description: 'From zero to Blockchain Engineer — sharing resources, mistakes, and insights from my path into Web3.',
    date: 'February 2026',
    readTime: '14 min read',
    category: 'Career',
    emoji: '📚',
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} | Md Imran`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  // Read markdown file
  const filePath = path.join(process.cwd(), 'blog', `${params.slug}.md`);
  
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-black/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/#blog" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span className="mr-2">←</span> Back to Portfolio
          </Link>
        </div>
      </header>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">{post.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-white/70 mb-6 max-w-2xl mx-auto">
            {post.description}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
              {post.category}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12
          prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-cyan-400
          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-cyan-300
          prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:underline
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:shadow-xl
          prose-ul:text-white/80 prose-ul:mb-6
          prose-ol:text-white/80 prose-ol:mb-6
          prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-cyan-400 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-white/70
          prose-img:rounded-lg prose-img:shadow-xl
          prose-hr:border-white/10 prose-hr:my-12
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Found this helpful? Let's connect!
            </h3>
            <p className="text-white/70 mb-6">
              I'm always open to discussing DeFi, smart contract security, and Web3 development.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/mdimran29"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10 hover:border-cyan-400/50"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/mdimran29"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10 hover:border-cyan-400/50"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/mdimran_29"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10 hover:border-cyan-400/50"
              >
                Twitter
              </a>
              <Link
                href="/#contact"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all font-semibold"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/#blog"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span className="mr-2">←</span> Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
