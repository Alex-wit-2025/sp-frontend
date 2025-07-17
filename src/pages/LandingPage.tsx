import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  PenTool, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Smartphone, 
  Clock, 
  Search,
  CheckCircle,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Features data
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create and access your notes instantly with our optimized performance and real-time sync across all devices.'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find any note in seconds with our powerful search that understands context and content.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share notes and collaborate with your team in real-time with comments and suggestions.'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Access your notes anywhere - web, mobile, tablet. Your ideas are always within reach.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your notes are encrypted and protected with enterprise-grade security and privacy controls.'
    },
    {
      icon: Bookmark,
      title: 'Smart Organization',
      description: 'Organize with tags, folders, and smart categories. Let AI help you structure your thoughts.'
    }
  ];

  // Benefits data
  const benefits = [
    'Capture ideas 3x faster than traditional methods',
    'Never lose a note with automatic cloud backup',
    'Organize thoughts with intelligent tagging',
    'Collaborate seamlessly with team members',
    'Access notes offline on any device',
    'Export to any format you need'
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-teal-600" />
              <span className="text-xl font-bold text-gray-900">Skribbled</span>
            </div>
            
            {/* Desktop Navigation - Empty but keeping structure */}
            <nav className="hidden md:flex space-x-8">
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-teal-600 transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/login" className="text-gray-600 hover:text-teal-600 transition-colors text-left">
                    Sign In
                  </Link>
                  <Link to="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-center">
                    Get Started
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-teal-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Ideas,
              <span className="bg-gradient-to-r from-teal-600 to-primary bg-clip-text text-transparent">
                {' '}Beautifully
              </span>
              <br />
              Organized
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Skribbled is the modern note-taking app that helps you capture, organize, 
              and share your thoughts effortlessly. Write better, think clearer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/login" className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="bg-gradient-to-r from-teal-600 to-primary rounded-lg h-64 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="text-lg">Your Notes, Organized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Write Better
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make note-taking effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Skribbled?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We've built Skribbled from the ground up to be the most intuitive and 
                powerful note-taking experience. Whether you're a student, professional, 
                or creative, Skribbled adapts to your workflow.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <FileText className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600">Notes Created</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Users className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+</h3>
                <p className="text-gray-600">Active Writers</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Share2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">25K+</h3>
                <p className="text-gray-600">Notes Shared</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Clock className="h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
                <p className="text-gray-600">Sync & Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who have made Skribbled their go-to note-taking companion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/login" className="bg-white text-teal-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white mr-2" />
                <span className="text-white font-medium">Stay Updated</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-primary-light text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <PenTool className="h-8 w-8 text-teal-400" />
                <span className="text-xl font-bold">Skribbled</span>
              </div>
              <p className="text-gray-400 mb-4">
                The modern note-taking app that helps you capture, organize, and share your thoughts effortlessly.
              </p>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg text-gray-400 font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg text-gray-400 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg text-gray-400 font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Skribbled. All rights reserved. Write better, think clearer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;