export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Beneficiary Parent",
      content: "Hope Foundation has transformed my child's future. The education support and scholarship program helped my daughter complete her studies when we couldn't afford it.",
      avatar: "PS"
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Community Doctor",
      content: "The health camps organized by Hope Foundation have made quality healthcare accessible to our rural community. Their dedication is truly inspiring.",
      avatar: "RK"
    },
    {
      name: "Anita Patel",
      role: "Women's Group Leader",
      content: "The skill development workshops empowered me to start my own tailoring business. Now I can support my family independently.",
      avatar: "AP"
    },
    {
      name: "Suresh Gupta",
      role: "Volunteer",
      content: "Being part of Hope Foundation's tree plantation drives has been incredibly fulfilling. We've made our neighborhood greener and healthier.",
      avatar: "SG"
    },
    {
      name: "Maria D'Souza",
      role: "Teacher",
      content: "The digital literacy program has transformed how we teach. Children now have access to modern learning tools and techniques.",
      avatar: "MD"
    },
    {
      name: "Ramesh Yadav",
      role: "Village Head",
      content: "Hope Foundation's community development projects have brought clean water and sanitation to our village. Life has improved significantly.",
      avatar: "RY"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stories of Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from the people whose lives have been touched by our programs and the volunteers who make it all possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 text-white p-8 md:p-12 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Be Part of Our Success Story
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of volunteers, donors, and beneficiaries. Together, we can create more stories of positive change and transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Support Our Cause
              </a>
              <a
                href="/volunteer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-colors"
              >
                Start Volunteering
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
