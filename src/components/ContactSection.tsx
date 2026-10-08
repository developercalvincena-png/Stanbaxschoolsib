import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  School as SchoolIcon
} from './RealIcons';

export const ContactSection: React.FC = () => {
  const { schoolInfo, submitInquiry } = useSchool();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    submitInquiry(fullName, email, subject || 'General Inquiry', message);
    setSubmitted(true);
    setFullName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span>Connect With Us</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Get in Touch with Stanbax Schools
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed">
              We welcome prospective parents, scholars, and community members. Contact our admissions desk or visit our main school premises in Ibadan.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">School Location</div>
                  <div className="text-xs text-stone-600 mt-0.5">{schoolInfo.address}, {schoolInfo.city}, {schoolInfo.state}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Telephone Lines</div>
                  <div className="text-xs text-stone-600 mt-0.5">{schoolInfo.phone} • {schoolInfo.whatsapp}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Administrative Email</div>
                  <div className="text-xs text-stone-600 mt-0.5">{schoolInfo.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">School Office Hours</div>
                  <div className="text-xs text-stone-600 mt-0.5">Monday – Friday: 07:30 AM – 04:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Send an Administrative Inquiry</h3>
            <p className="text-xs text-stone-500 mb-6">Our registry team responds to inquiries within 24 hours.</p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Inquiry Submitted Successfully</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out. The administrative registry has received your message.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Mr. Adebayo Adeleke"
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. adeleke@gmail.com"
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Admission Inquiry for JSS 1"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to School Registry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
