import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms of Service</h1>
            <p className="font-sans text-gray-300 text-lg">Last updated: October 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="space-y-8 font-sans text-gray-700 leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">1. Agreement to Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                METAHAIR's website for personal, non-commercial transitory viewing only. This is the grant of a license,
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">3. Disclaimer</h2>
              <p>
                The materials on METAHAIR's website are provided on an 'as is' basis. METAHAIR makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">4. Limitations</h2>
              <p>
                In no event shall METAHAIR or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on METAHAIR's website, even if METAHAIR or an authorized representative has been
                notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on METAHAIR's website could include technical, typographical, or photographic
                errors. METAHAIR does not warrant that any of the materials on its website are accurate, complete, or
                current. METAHAIR may make changes to the materials contained on its website at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">6. Links</h2>
              <p>
                METAHAIR has not reviewed all of the sites linked to its website and is not responsible for the contents
                of any such linked site. The inclusion of any link does not imply endorsement by METAHAIR of the site.
                Use of any such linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">7. Modifications</h2>
              <p>
                METAHAIR may revise these terms of service for its website at any time without notice. By using this
                website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you
                irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4 text-black">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at legal@metahair.com or
                through our website contact form.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
