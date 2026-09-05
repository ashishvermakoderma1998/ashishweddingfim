import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  FileText,
  Sparkles,
  Camera,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Booking, Enquiry, Review, AdminStats, BookingStatus, PaymentStatus } from '../types';

interface AdminDashboardPageProps {
  onNavigateToLogin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateToLogin }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries' | 'reviews' | 'services'>('bookings');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData, enquiriesData, reviewsData] = await Promise.all([
        api.getAdminStats(),
        api.getBookings(),
        api.getEnquiries(),
        api.getReviews(),
      ]);

      setStats(statsData);
      setBookings(bookingsData);
      setEnquiries(enquiriesData);
      setReviews(reviewsData);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      showToast('Failed to load studio admin dashboard data', 'error');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div id="admin-unauth" className="min-h-screen bg-neutral-950 text-neutral-100 pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold font-serif text-white">Studio Admin Clearance Required</h2>
          <p className="text-xs text-neutral-400">
            You must be logged in as an administrator (ashishweddingfilm@gmail.com) to access bookings, client CRM, and studio revenue.
          </p>
          <button
            onClick={onNavigateToLogin}
            className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-colors"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await api.updateBookingStatus(id, { bookingStatus: status });
      showToast(`Booking status updated to ${status}`, 'success');
      loadAdminData();
      if (selectedBookingDetails && selectedBookingDetails.id === id) {
        setSelectedBookingDetails({ ...selectedBookingDetails, bookingStatus: status });
      }
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleUpdatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      await api.updateBookingStatus(id, { paymentStatus: status });
      showToast(`Payment status updated to ${status}`, 'success');
      loadAdminData();
      if (selectedBookingDetails && selectedBookingDetails.id === id) {
        setSelectedBookingDetails({ ...selectedBookingDetails, paymentStatus: status });
      }
    } catch (err: any) {
      showToast(err.message || 'Payment status update failed', 'error');
    }
  };

  const handleToggleReviewApproval = async (id: string, currentApproved?: boolean) => {
    try {
      await api.approveReview(id, !currentApproved);
      showToast('Review visibility updated', 'info');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Review update failed', 'error');
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await api.updateEnquiry(id, { status });
      showToast(`Enquiry marked as ${status}`, 'info');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Enquiry update failed', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="p-8 rounded-3xl bg-neutral-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-extrabold text-[10px] uppercase">
                  Studio Admin Control
                </span>
                <span className="text-xs text-neutral-400">Ashish Wedding Film Studio Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                Studio Management & Client CRM
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-300 transition-colors"
            >
              ↻ Refresh Live Data
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Total Bookings</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold font-serif text-white">{stats.totalBookings}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-400 font-bold">{stats.confirmedBookings} Confirmed</span>
                <span className="text-neutral-500">•</span>
                <span className="text-amber-400">{stats.inProgressBookings} In Progress</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Total Studio Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold font-serif text-emerald-400">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-neutral-400">Advance deposits collected online</p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Enquiries & Leads</span>
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold font-serif text-white">{stats.totalEnquiries}</p>
              <p className="text-[11px] text-blue-400 font-semibold">{stats.newEnquiries} New Inquiries</p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Client Reviews</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold font-serif text-white">{stats.totalReviews}</p>
              <p className="text-[11px] text-amber-400 font-semibold">100% 5-Star Studio Rating</p>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            Client Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            Testimonial Moderation ({reviews.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by client, ID, city..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Booking Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-4">Ref #</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Service & Date</th>
                      <th className="p-4">Venue Location</th>
                      <th className="p-4">Advance</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-amber-400">{b.bookingNumber}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{b.userName}</div>
                          <div className="text-[11px] text-neutral-400">{b.userPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-neutral-200">{b.serviceTitle}</div>
                          <div className="text-[11px] text-amber-400">{b.eventDate} ({b.eventTime})</div>
                        </td>
                        <td className="p-4 max-w-[180px] truncate text-neutral-300">
                          {b.eventLocation}
                        </td>
                        <td className="p-4 font-bold text-emerald-400">
                          ₹{b.advanceAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                            title="View Full Booking Info"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/${(b.userPhone || '8709017294').replace(/\D/g, '').replace(/^91/, '') ? '91' + (b.userPhone || '8709017294').replace(/\D/g, '').replace(/^91/, '') : '918709017294'}?text=Hello%20${encodeURIComponent(b.userName)},%20this%20is%20Ashish%20Wedding%20Film%20Studio%20regarding%20your%20booking%20${b.bookingNumber}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 inline-block align-middle"
                            title="Contact via WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                        {enq.service}
                      </span>
                      <span className="text-[11px] text-neutral-500">{enq.createdAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{enq.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>Phone: {enq.phone}</span>
                      <span>•</span>
                      <span>Email: {enq.email || 'None'}</span>
                    </div>

                    <p className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800 italic">
                      “{enq.message}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <span className="text-xs text-neutral-400 font-semibold">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as Enquiry['status'])}
                      className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="New">New</option>
                      <option value="In Touch">In Touch</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.approved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {r.approved ? 'Live on Website' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-neutral-200 italic">“{r.comment}”</p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                  <div>
                    <strong className="text-white block">{r.userName}</strong>
                    <span className="text-neutral-500 text-[10px]">{r.eventType}</span>
                  </div>

                  <button
                    onClick={() => handleToggleReviewApproval(r.id, r.approved)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-300"
                  >
                    {r.approved ? 'Hide Review' : 'Approve Review'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-3xl bg-neutral-950 border border-amber-500/40 p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-white">Full Client Booking Details</h3>
                  <p className="text-xs text-amber-400 font-semibold">{selectedBookingDetails.bookingNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px]">Client</span>
                    <strong className="text-white text-sm">{selectedBookingDetails.userName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px]">Phone</span>
                    <span className="text-white text-sm">{selectedBookingDetails.userPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px]">Event Date</span>
                    <span className="text-white">{selectedBookingDetails.eventDate} ({selectedBookingDetails.eventTime})</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[10px]">Location</span>
                    <span className="text-white">{selectedBookingDetails.eventLocation}</span>
                  </div>
                </div>

                {selectedBookingDetails.additionalRequirements && (
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <strong className="text-amber-400 block mb-1">Custom Notes:</strong>
                    <p className="text-neutral-300">{selectedBookingDetails.additionalRequirements}</p>
                  </div>
                )}

                {selectedBookingDetails.referenceImages && selectedBookingDetails.referenceImages.length > 0 && (
                  <div>
                    <strong className="text-neutral-400 block mb-2">Reference Photos:</strong>
                    <div className="flex flex-wrap gap-2">
                      {selectedBookingDetails.referenceImages.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                          <img src={img} alt="Ref" className="w-16 h-16 rounded-xl object-cover border border-amber-500/40" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <a
                  href={`tel:${selectedBookingDetails.userPhone}`}
                  className="flex-1 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Client</span>
                </a>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
