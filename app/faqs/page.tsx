import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function FAQsPage() {
  const faqs = [
    {
      question: "What is METAHAIR?",
      answer:
        "METAHAIR is a luxury wig brand dedicated to providing premium quality wigs that help you express your style and confidence. Our wigs are crafted with the finest materials and attention to detail.",
    },
    {
      question: "How do I choose the right wig size?",
      answer:
        "We offer detailed sizing guides on each product page. Measure your head circumference and compare it with our size chart. If you're unsure, our customer service team is happy to help you find the perfect fit.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unworn wigs in original packaging. If you're not satisfied with your purchase, contact our support team to initiate a return.",
    },
    {
      question: "How should I care for my wig?",
      answer:
        "Each wig comes with detailed care instructions. Generally, wash with cool water using wig-specific shampoo, condition, and air dry on a wig stand. Avoid heat styling unless the wig is heat-resistant.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship internationally. Shipping costs vary by location. Select your country at checkout to see available shipping options and rates.",
    },
    {
      question: "Can I customize a wig?",
      answer:
        "We offer custom wig services for bulk orders. Contact our sales team at support@metahair.com to discuss your customization needs.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods through our secure Paystack payment gateway.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery times vary by location. Within Lagos: 1-2 business days. Outside Lagos but within Nigeria: 3-5 business days. International: 7-14 business days.",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
            <p className="font-sans text-gray-300 text-lg">Find answers to common questions about METAHAIR</p>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="font-serif text-xl md:text-2xl mb-4 text-black">{faq.question}</h3>
                <p className="font-sans text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gray-50 p-8 md:p-12">
            <h3 className="font-serif text-2xl mb-4">Still have questions?</h3>
            <p className="font-sans text-gray-600 mb-6">
              Our customer support team is here to help. Reach out to us at support@metahair.com or use the contact form
              on our website.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
