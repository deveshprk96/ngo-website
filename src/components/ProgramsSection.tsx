import { BookOpen, Heart, Leaf, Users, Home, Utensils } from 'lucide-react';

export default function ProgramsSection() {
  const programs = [
    {
      icon: BookOpen,
      title: "Education for All",
      description: "Free education and scholarship programs for underprivileged children",
      impact: "200+ students supported",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Heart,
      title: "Healthcare Support",
      description: "Medical camps, health awareness, and emergency medical assistance",
      impact: "500+ patients treated",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Leaf,
      title: "Environment Conservation",
      description: "Tree plantation drives, clean-up campaigns, and awareness programs",
      impact: "1000+ trees planted",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skill development workshops and entrepreneurship support for women",
      impact: "150+ women trained",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Home,
      title: "Community Development",
      description: "Infrastructure development and community welfare projects",
      impact: "10+ villages reached",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Utensils,
      title: "Food Security",
      description: "Meal distribution programs and nutrition awareness campaigns",
      impact: "5000+ meals served",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We run comprehensive programs across multiple sectors to create lasting positive change in communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${program.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {program.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">
                    {program.impact}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Want to Support Our Programs?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Your contribution can help us expand these programs and reach more communities in need. 
            Every donation makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Donate Now
            </a>
            <a
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-colors"
            >
              Volunteer With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
