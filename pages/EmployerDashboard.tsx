import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Building2, Briefcase, Users, Settings, 
  Plus, Search, MapPin, Globe, Users2, FileText, 
  Bell, CheckCircle2, MoreHorizontal, Eye, TrendingUp,
  Download, Filter, ChevronDown, Check, X, Wand2, Calendar,
  CreditCard, LogOut, Camera, Clock, Pencil, Lock, RotateCcw, AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { Link, useLocation } from 'react-router-dom';
import { generateJobDescription } from '../services/aiService';

// --- TYPES ---
interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  description: string;
  email: string;
  phone: string;
  logo?: string;
}

interface JobPost {
  id: number;
  title: string;
  type: string;
  salary: string;
  location: string;
  postedDate: string;
  expiresDate: string;
  views: number;
  applications: number;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED' | 'EXPIRED';
  description?: string; // Added for edit/view
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
  bg: string;
  isUnread: boolean;
}

// --- MOCK DATA ---
const MOCK_COMPANY: CompanyProfile = {
  name: 'TechCorp Vietnam',
  industry: 'Công nghệ thông tin',
  size: '100-499 nhân viên',
  website: 'https://techcorp.vn',
  location: 'Quận 1, TP. Hồ Chí Minh',
  description: 'TechCorp là công ty công nghệ hàng đầu chuyên cung cấp các giải pháp phần mềm cho doanh nghiệp. Môi trường làm việc năng động, sáng tạo.',
  email: 'hr@techcorp.vn',
  phone: '028 3838 8888',
  logo: null
};

const MOCK_JOBS: JobPost[] = [
  { 
    id: 1, title: 'Senior React Engineer', type: 'Toàn thời gian', salary: '2500$ - 3500$', 
    location: 'Hồ Chí Minh', postedDate: '10/10/2023', expiresDate: '10/11/2023',
    views: 1250, applications: 45, status: 'ACTIVE',
    description: 'Mô tả công việc mẫu cho vị trí React Engineer...'
  },
  { 
    id: 2, title: 'Product Manager', type: 'Toàn thời gian', salary: '3000$ - 5000$', 
    location: 'Hà Nội', postedDate: '05/10/2023', expiresDate: '05/11/2023',
    views: 890, applications: 12, status: 'ACTIVE',
    description: 'Mô tả công việc mẫu cho Product Manager...'
  },
  { 
    id: 3, title: 'Fresher Tester', type: 'Thực tập', salary: '3 - 5 Triệu', 
    location: 'Hồ Chí Minh', postedDate: '01/09/2023', expiresDate: '01/10/2023',
    views: 2100, applications: 156, status: 'CLOSED',
    description: 'Mô tả công việc mẫu cho Tester...'
  },
  { 
    id: 4, title: 'Backend Developer (Node.js)', type: 'Toàn thời gian', salary: '2000$ - 3000$', 
    location: 'Đà Nẵng', postedDate: '01/10/2023', expiresDate: '30/10/2023',
    views: 1500, applications: 30, status: 'ACTIVE',
    description: 'Mô tả công việc mẫu cho Nodejs...'
  },
  { 
    id: 5, title: 'HR Specialist', type: 'Toàn thời gian', salary: '15 - 20 Triệu', 
    location: 'Hồ Chí Minh', postedDate: '15/09/2023', expiresDate: '15/10/2023',
    views: 950, applications: 80, status: 'EXPIRED',
    description: 'Mô tả công việc mẫu cho HR...'
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Ứng viên mới nộp hồ sơ',
    description: 'Nguyễn Văn A vừa nộp hồ sơ vào vị trí Senior React Engineer.',
    time: '15 phút trước',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    isUnread: true
  },
  {
    id: 2,
    title: 'Tin tuyển dụng sắp hết hạn',
    description: 'Vị trí Product Manager sẽ hết hạn trong 3 ngày tới.',
    time: '5 giờ trước',
    icon: Calendar,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    isUnread: true
  },
  {
    id: 3,
    title: 'Thanh toán thành công',
    description: 'Gói dịch vụ "Tuyển dụng VIP" đã được kích hoạt.',
    time: '1 ngày trước',
    icon: CreditCard,
    color: 'text-green-600',
    bg: 'bg-green-100',
    isUnread: false
  }
];

export const EmployerDashboard: React.FC = () => {
  const { addToast } = useToast();
  const location = useLocation();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'jobs' | 'candidates'>('overview');
  
  // Profile State
  const [company, setCompany] = useState<CompanyProfile>(MOCK_COMPANY);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  // Jobs State
  const [jobs, setJobs] = useState<JobPost[]>(MOCK_JOBS);
  
  // Modals State
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Post/Edit Job Form State (Shared state for both actions)
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobKeywords, setNewJobKeywords] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobType, setNewJobType] = useState('Toàn thời gian');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Sync tab from router state
  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state?.tab && ['overview', 'profile', 'jobs', 'candidates'].includes(state.tab)) {
      setActiveTab(state.tab as any);
    }
  }, [location]);

  // --- HANDLERS ---
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
      addToast('Cập nhật logo công ty thành công', 'success');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    addToast('Cập nhật thông tin công ty thành công!', 'success');
  };

  const resetJobForm = () => {
    setNewJobTitle('');
    setNewJobKeywords('');
    setNewJobDesc('');
    setNewJobSalary('');
    setNewJobLocation('');
    setNewJobType('Toàn thời gian');
    setSelectedJob(null);
  };

  const handleOpenPostJob = () => {
    resetJobForm();
    setIsPostJobModalOpen(true);
  };

  const handleOpenEditJob = (job: JobPost) => {
    setSelectedJob(job);
    setNewJobTitle(job.title);
    setNewJobSalary(job.salary);
    setNewJobLocation(job.location);
    setNewJobType(job.type);
    setNewJobDesc(job.description || '');
    setIsEditJobModalOpen(true);
  };

  const handleOpenViewJob = (job: JobPost) => {
    setSelectedJob(job);
    setIsViewJobModalOpen(true);
  };

  const handleOpenStatusModal = (job: JobPost) => {
    if (job.status === 'PENDING' || job.status === 'EXPIRED') return;
    setSelectedJob(job);
    setIsStatusModalOpen(true);
  };

  const handleGenerateAI = async () => {
    if (!newJobTitle) {
      addToast('Vui lòng nhập tiêu đề công việc trước', 'error');
      return;
    }
    setIsGeneratingAI(true);
    const desc = await generateJobDescription(newJobTitle, newJobKeywords || 'chuyên nghiệp, chi tiết, đầy đủ');
    setNewJobDesc(desc);
    setIsGeneratingAI(false);
    addToast('Đã tạo mô tả công việc bằng AI!', 'success');
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobPost = {
        id: Date.now(),
        title: newJobTitle,
        type: newJobType,
        salary: newJobSalary || 'Thỏa thuận',
        location: newJobLocation || company.location.split(',')[0],
        postedDate: new Date().toLocaleDateString('vi-VN'),
        expiresDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('vi-VN'),
        views: 0,
        applications: 0,
        status: 'PENDING',
        description: newJobDesc
    };
    setJobs([newJob, ...jobs]);
    setIsPostJobModalOpen(false);
    resetJobForm();
    addToast('Đăng tin thành công! Tin đang chờ duyệt.', 'success');
  };

  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const updatedJobs = jobs.map(j => j.id === selectedJob.id ? {
      ...j,
      title: newJobTitle,
      type: newJobType,
      salary: newJobSalary,
      location: newJobLocation,
      description: newJobDesc
    } : j);

    setJobs(updatedJobs);
    setIsEditJobModalOpen(false);
    resetJobForm();
    addToast('Cập nhật tin tuyển dụng thành công!', 'success');
  };

  const handleConfirmStatusChange = () => {
     if (!selectedJob) return;
     
     const newStatus = selectedJob.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
     const updatedJobs = jobs.map(job => 
        job.id === selectedJob.id ? { ...job, status: newStatus as any } : job
     );
     setJobs(updatedJobs);
     
     setIsStatusModalOpen(false);
     if (newStatus === 'ACTIVE') {
        addToast('Đã mở lại tin tuyển dụng', 'success');
     } else {
        addToast('Đã đóng tin tuyển dụng', 'info');
     }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Đang hiển thị</span>;
      case 'PENDING': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Chờ duyệt</span>;
      case 'CLOSED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Đã đóng</span>;
      case 'EXPIRED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Hết hạn</span>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24 z-30">
            
            {/* Company Header */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
              <div className="relative group mb-4">
                <div className="h-24 w-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                   {logo ? (
                     <img src={logo} alt="Logo" className="h-full w-full object-contain p-2" />
                   ) : (
                     <Building2 className="h-10 w-10 text-gray-300" />
                   )}
                </div>
                <label 
                  htmlFor="logo-upload" 
                  className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full border border-gray-200 shadow-md cursor-pointer hover:bg-primary-50 transition-colors text-gray-500 hover:text-primary-600"
                >
                   <Camera className="h-4 w-4" />
                   <input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoChange}
                   />
                </label>
              </div>

              <h2 className="font-bold text-gray-900 text-lg text-center">{company.name}</h2>
              <p className="text-gray-500 text-xs font-medium mb-4">{company.industry}</p>
              
              <div className="w-full">
                 <div className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Tài khoản đã xác thực
                 </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
                { id: 'profile', label: 'Hồ sơ công ty', icon: Building2 },
                { id: 'jobs', label: 'Quản lý tin đăng', icon: Briefcase },
                { id: 'candidates', label: 'Tìm ứng viên', icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-5 -mt-5"></div>
                  <h4 className="font-bold text-sm mb-1">Gói VIP Enterprise</h4>
                  <p className="text-xs text-gray-400 mb-3">Hết hạn: 30/12/2024</p>
                  <Button size="sm" variant="white" className="w-full text-xs h-8">Nâng cấp</Button>
               </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 min-w-0">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
                  <Button onClick={handleOpenPostJob} className="shadow-lg shadow-primary-200">
                    <Plus className="mr-2 h-5 w-5" /> Đăng tin mới
                  </Button>
               </div>

               {/* Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Tin đang hiển thị', value: '2', sub: 'Tổng số 5 tin', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Lượt ứng tuyển mới', value: '18', sub: '+5 so với hôm qua', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Lượt xem hồ sơ', value: '1,203', sub: 'Trong 30 ngày qua', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                      </div>
                      <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Notifications */}
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                              <Bell className="h-5 w-5 text-primary-600" /> Thông báo mới
                           </h3>
                           <button className="text-sm text-primary-600 font-medium hover:underline">Đánh dấu đã đọc</button>
                      </div>
                      <div className="space-y-4">
                            {MOCK_NOTIFICATIONS.map((notif) => (
                                <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:bg-gray-50 cursor-pointer ${notif.isUnread ? 'bg-white border-primary-100 shadow-sm' : 'bg-gray-50/50 border-gray-100'}`}>
                                    <div className={`h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center ${notif.bg} ${notif.color}`}>
                                        <notif.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-sm ${notif.isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{notif.description}</p>
                                    </div>
                                    {notif.isUnread && (
                                        <div className="h-2 w-2 rounded-full bg-primary-500 mt-2"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                  </div>

                  {/* Quick Actions / Tips */}
                  <div className="space-y-6">
                     <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                           <TrendingUp className="h-5 w-5 text-yellow-300" /> Tìm ứng viên nhanh
                        </h3>
                        <p className="text-primary-100 text-sm mb-4">
                           Truy cập kho dữ liệu 100,000+ hồ sơ ứng viên chất lượng cao.
                        </p>
                        <Button variant="white" size="sm" className="w-full text-primary-700 hover:bg-gray-50 border-none" onClick={() => setActiveTab('candidates')}>
                           Tìm ngay
                        </Button>
                     </div>

                     <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">Trạng thái tài khoản</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex justify-between py-2 border-b border-gray-50">
                             <span className="text-gray-500">Loại tài khoản</span>
                             <span className="font-bold text-gray-900">Doanh nghiệp</span>
                           </div>
                           <div className="flex justify-between py-2">
                             <span className="text-gray-500">Tin đăng còn lại</span>
                             <span className="font-bold text-primary-600">3/5 tin</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Hồ sơ công ty</h1>
                  {!isEditingProfile && (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                       Chỉnh sửa
                    </Button>
                  )}
               </div>

               <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <form onSubmit={handleUpdateProfile}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                           <input 
                              type="text" 
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                              value={company.name}
                              onChange={(e) => setCompany({...company, name: e.target.value})}
                              disabled={!isEditingProfile}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                           <div className="relative">
                              <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input 
                                 type="text" 
                                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                 value={company.website}
                                 onChange={(e) => setCompany({...company, website: e.target.value})}
                                 disabled={!isEditingProfile}
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực hoạt động</label>
                           <select 
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                              value={company.industry}
                              onChange={(e) => setCompany({...company, industry: e.target.value})}
                              disabled={!isEditingProfile}
                           >
                              <option>Công nghệ thông tin</option>
                              <option>Marketing / Truyền thông</option>
                              <option>Tài chính / Ngân hàng</option>
                              <option>Sản xuất</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
                           <select 
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                              value={company.size}
                              onChange={(e) => setCompany({...company, size: e.target.value})}
                              disabled={!isEditingProfile}
                           >
                              <option>10-50 nhân viên</option>
                              <option>50-100 nhân viên</option>
                              <option>100-499 nhân viên</option>
                              <option>500+ nhân viên</option>
                           </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ trụ sở</label>
                           <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input 
                                 type="text" 
                                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                 value={company.location}
                                 onChange={(e) => setCompany({...company, location: e.target.value})}
                                 disabled={!isEditingProfile}
                              />
                           </div>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu về công ty</label>
                           <textarea 
                              rows={5}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                              value={company.description}
                              onChange={(e) => setCompany({...company, description: e.target.value})}
                              disabled={!isEditingProfile}
                           ></textarea>
                        </div>
                     </div>

                     {isEditingProfile && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                           <Button type="button" variant="ghost" onClick={() => setIsEditingProfile(false)}>Hủy bỏ</Button>
                           <Button type="submit">Lưu thay đổi</Button>
                        </div>
                     )}
                  </form>
               </div>
            </div>
          )}

          {/* 3. JOBS TAB */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Quản lý tin đăng</h1>
                  <Button onClick={handleOpenPostJob} className="shadow-lg shadow-primary-200">
                    <Plus className="mr-2 h-5 w-5" /> Đăng tin mới
                  </Button>
               </div>

               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                   <div className="p-4 border-b border-gray-200 flex gap-4 bg-gray-50">
                      <div className="relative flex-1 max-w-sm">
                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                         <input 
                           type="text" 
                           placeholder="Tìm kiếm tin đăng..." 
                           className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                         />
                      </div>
                      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-primary-500 focus:border-primary-500">
                         <option>Tất cả trạng thái</option>
                         <option>Đang hiển thị</option>
                         <option>Chờ duyệt</option>
                         <option>Đã đóng</option>
                      </select>
                   </div>
                   
                   <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
                      {/* Added min-w-[1000px] to force horizontal scroll */}
                      <table className="w-full text-sm text-left min-w-[1000px]">
                        <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs tracking-wider sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-6 py-4 bg-gray-50">Vị trí tuyển dụng</th>
                            <th className="px-6 py-4 bg-gray-50">Ngày đăng / Hết hạn</th>
                            <th className="px-6 py-4 bg-gray-50 text-center">Thống kê</th>
                            <th className="px-6 py-4 bg-gray-50">Trạng thái</th>
                            <th className="px-6 py-4 bg-gray-50 text-right min-w-[180px]">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-gray-900 text-sm mb-1">{job.title}</div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Badge variant="outline" className="text-[10px] bg-white px-1.5">{job.type}</Badge>
                                    <span>•</span>
                                    <span>{job.salary}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {job.postedDate}</div>
                                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-gray-400" /> {job.expiresDate}</div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-4">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{job.views}</div>
                                        <div className="text-[10px] text-gray-500">Lượt xem</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-primary-600">{job.applications}</div>
                                        <div className="text-[10px] text-gray-500">Ứng tuyển</div>
                                    </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  {getStatusBadge(job.status)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-3">
                                     <button 
                                        onClick={() => handleOpenViewJob(job)}
                                        className="h-10 w-10 p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-colors" 
                                        title="Xem chi tiết"
                                     >
                                        <Eye className="h-5 w-5" />
                                     </button>
                                     
                                     <button 
                                        onClick={() => handleOpenEditJob(job)}
                                        className="h-10 w-10 p-2 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" 
                                        title="Chỉnh sửa"
                                     >
                                        <Pencil className="h-5 w-5" />
                                     </button>

                                     {job.status === 'ACTIVE' && (
                                        <button 
                                          className="h-10 w-10 p-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" 
                                          title="Đóng tin tuyển dụng"
                                          onClick={() => handleOpenStatusModal(job)}
                                        >
                                          <Lock className="h-5 w-5" />
                                        </button>
                                     )}

                                     {job.status === 'CLOSED' && (
                                        <button 
                                          className="h-10 w-10 p-2 rounded-lg text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors" 
                                          title="Mở lại tin tuyển dụng"
                                          onClick={() => handleOpenStatusModal(job)}
                                        >
                                          <RotateCcw className="h-5 w-5" />
                                        </button>
                                     )}
                                  </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
               </div>
            </div>
          )}
          
          {/* 4. CANDIDATES SEARCH TAB (Direct Link) */}
          {activeTab === 'candidates' && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="h-24 w-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Search className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tìm kiếm ứng viên tiềm năng</h2>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                   Truy cập công cụ tìm kiếm nâng cao để lọc hồ sơ theo kỹ năng, kinh nghiệm và địa điểm.
                </p>
                <Link to="/employer/search-candidates">
                   <Button size="lg" className="shadow-lg shadow-primary-200">
                      Đi tới trang tìm kiếm <ChevronDown className="h-5 w-5 ml-2 -rotate-90" />
                   </Button>
                </Link>
            </div>
          )}

        </div>
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. POST JOB MODAL */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
           <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-xl text-gray-900">Đăng tin tuyển dụng mới</h3>
                 <button onClick={() => setIsPostJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                  <form id="post-job-form" onSubmit={handlePostJob} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Tiêu đề công việc <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-lg"
                          placeholder="Ví dụ: Senior Marketing Executive"
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                                placeholder="VD: 15-20 Triệu"
                                value={newJobSalary}
                                onChange={(e) => setNewJobSalary(e.target.value)}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm làm việc</label>
                            <select 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                                value={newJobLocation}
                                onChange={(e) => setNewJobLocation(e.target.value)}
                            >
                               <option value="">Chọn địa điểm</option>
                               <option value={company.location.split(',')[0]}>{company.location.split(',')[0]}</option>
                               <option value="Hà Nội">Hà Nội</option>
                               <option value="Đà Nẵng">Đà Nẵng</option>
                               <option value="Remote">Remote</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức</label>
                            <select 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                                value={newJobType}
                                onChange={(e) => setNewJobType(e.target.value)}
                            >
                               <option>Toàn thời gian</option>
                               <option>Bán thời gian</option>
                               <option>Thực tập</option>
                               <option>Freelance</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn nộp hồ sơ</label>
                            <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                         </div>
                      </div>

                      {/* AI GENERATOR SECTION */}
                      <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border border-primary-100">
                         <div className="flex items-center gap-2 mb-3">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                               <Wand2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-primary-900">AI Viết mô tả công việc</span>
                            <Badge variant="default" className="bg-primary-200 text-primary-800 border-none ml-auto">Beta</Badge>
                         </div>
                         <div className="flex gap-3">
                            <input 
                              type="text" 
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Nhập từ khóa (VD: React, tiếng Anh, năng động...)"
                              value={newJobKeywords}
                              onChange={(e) => setNewJobKeywords(e.target.value)}
                            />
                            <Button 
                              type="button" 
                              onClick={handleGenerateAI} 
                              isLoading={isGeneratingAI}
                              className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200"
                            >
                              Tạo nội dung
                            </Button>
                         </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                        <textarea 
                          rows={10} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                          placeholder="Mô tả công việc, yêu cầu, quyền lợi..."
                          value={newJobDesc}
                          onChange={(e) => setNewJobDesc(e.target.value)}
                        ></textarea>
                      </div>
                  </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                 <Button variant="ghost" onClick={() => setIsPostJobModalOpen(false)}>Hủy bỏ</Button>
                 <Button type="submit" form="post-job-form" className="shadow-lg shadow-primary-200 px-8">Đăng tin ngay</Button>
              </div>
           </div>
        </div>
      )}

      {/* 2. EDIT JOB MODAL */}
      {isEditJobModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
           <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-xl text-gray-900">Chỉnh sửa tin tuyển dụng</h3>
                 <button onClick={() => setIsEditJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                  <form id="edit-job-form" onSubmit={handleUpdateJob} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Tiêu đề công việc <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-lg"
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                                value={newJobSalary}
                                onChange={(e) => setNewJobSalary(e.target.value)}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm làm việc</label>
                            <select 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                                value={newJobLocation}
                                onChange={(e) => setNewJobLocation(e.target.value)}
                            >
                               <option value="">Chọn địa điểm</option>
                               <option value={company.location.split(',')[0]}>{company.location.split(',')[0]}</option>
                               <option value="Hà Nội">Hà Nội</option>
                               <option value="Đà Nẵng">Đà Nẵng</option>
                               <option value="Remote">Remote</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức</label>
                            <select 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                                value={newJobType}
                                onChange={(e) => setNewJobType(e.target.value)}
                            >
                               <option>Toàn thời gian</option>
                               <option>Bán thời gian</option>
                               <option>Thực tập</option>
                               <option>Freelance</option>
                            </select>
                         </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                        <textarea 
                          rows={10} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                          value={newJobDesc}
                          onChange={(e) => setNewJobDesc(e.target.value)}
                        ></textarea>
                      </div>
                  </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                 <Button variant="ghost" onClick={() => setIsEditJobModalOpen(false)}>Hủy bỏ</Button>
                 <Button type="submit" form="edit-job-form" className="shadow-lg shadow-blue-200 px-8 bg-blue-600 hover:bg-blue-700 text-white">Cập nhật tin</Button>
              </div>
           </div>
        </div>
      )}

      {/* 3. VIEW JOB MODAL */}
      {isViewJobModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div className="flex gap-4">
                    <div className="h-14 w-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-primary-600">
                        <Building2 className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-900">{selectedJob.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {selectedJob.location}</span>
                            <span className="flex items-center gap-1 text-green-600 font-medium"><CreditCard className="h-3.5 w-3.5"/> {selectedJob.salary}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsViewJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                 <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Lượt xem</div>
                        <div className="text-2xl font-bold text-gray-900">{selectedJob.views}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Lượt ứng tuyển</div>
                        <div className="text-2xl font-bold text-primary-600">{selectedJob.applications}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Trạng thái</div>
                        <div className="mt-1">{getStatusBadge(selectedJob.status)}</div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">Chi tiết công việc</h4>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {selectedJob.description || "Chưa có mô tả chi tiết."}
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex gap-6 text-sm text-gray-500">
                         <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Ngày đăng: {selectedJob.postedDate}</span>
                         <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> Hết hạn: {selectedJob.expiresDate}</span>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <Button onClick={() => setIsViewJobModalOpen(false)}>Đóng</Button>
              </div>
           </div>
        </div>
      )}

      {/* 4. STATUS CHANGE CONFIRMATION MODAL */}
      {isStatusModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-100 transition-all">
              <div className="p-6 text-center">
                 <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedJob.status === 'ACTIVE' ? 'bg-red-100' : 'bg-green-100'}`}>
                    {selectedJob.status === 'ACTIVE' ? (
                        <Lock className="h-8 w-8 text-red-600" />
                    ) : (
                        <RotateCcw className="h-8 w-8 text-green-600" />
                    )}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedJob.status === 'ACTIVE' ? 'Đóng tin tuyển dụng?' : 'Mở lại tin tuyển dụng?'}
                 </h3>
                 <p className="text-gray-500 mb-6">
                    {selectedJob.status === 'ACTIVE' 
                        ? 'Tin tuyển dụng sẽ không còn hiển thị với ứng viên. Bạn có thể mở lại sau.' 
                        : 'Tin tuyển dụng sẽ được hiển thị công khai trở lại để ứng viên nộp hồ sơ.'}
                 </p>
                 <div className="flex gap-3 justify-center">
                    <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)} className="w-full">Hủy bỏ</Button>
                    <Button 
                        onClick={handleConfirmStatusChange} 
                        className={`w-full text-white ${selectedJob.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {selectedJob.status === 'ACTIVE' ? 'Xác nhận đóng' : 'Xác nhận mở lại'}
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};