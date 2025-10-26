import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
            <p className="font-sans text-gray-300 text-lg">Last updated: October 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="space-y-8 font-sans text-gray-700 leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">1. Introduction</h2>
              <p>
                METAHAIR ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website and
                use our services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">2. Information We Collect</h2>
              <p className="mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site
                includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Personal Data: Name, email address, phone number, shipping address, billing address, payment
                  information
                </li>
                <li>Device Data: Browser type, IP address, operating system, referring URLs</li>
                <li>Usage Data: Pages visited, time spent on pages, links clicked, search queries</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">3. Use of Your Information</h2>
              <p className="mb-4">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized
                experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your transactions and send related information</li>
                <li>Email you regarding your order status and updates</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
                <li>Generate a personal profile about you so that future visits to the Site will be personalized</li>
                <li>Increase the efficiency and operation of the Site</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">4. Disclosure of Your Information</h2>
              <p>
                We may share your information with third parties who perform services for us, including payment
                processors, shipping providers, and email service providers. We will not sell, trade, or rent your
                personal information to others without your consent, except as necessary to provide the services you
                request.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information.
                However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                While we strive to use commercially acceptable means to protect your personal information, we cannot
                guarantee its absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">6. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at privacy@metahair.com
                or through our website contact form.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
