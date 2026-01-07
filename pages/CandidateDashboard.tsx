import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Briefcase, Upload, Heart, Eye, 
  LayoutDashboard, MapPin, Building2, Calendar, 
  CheckCircle2, Clock, Trash2, Pencil, Plus, X,
  Languages, Star, Zap, Award, AlertTriangle, Download,
  MoreHorizontal, Camera, ChevronDown, Check, Globe, Lock,
  ArrowRight, TrendingUp, Sparkles, Bell
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { Link, useLocation } from 'react-router-dom';

// --- TYPES ---
interface Experience {
  id: number;
  company: string;
  title: string;
  type: string;
  location: string;
  startDate: string; 
  endDate?: string;  
  isCurrent: boolean;
  description: string;
}

interface LanguageItem {
  id: number;
  name: string;
  level: string;
}

interface SkillItem {
  id: number;
  name: string;
  rating: number; // 1-5
}

interface ApplicationItem {
  id: number;
  title: string;
  company: string;
  location: string;
  date: string;
  status: string;
  statusType: 'success' | 'warning' | 'danger' | 'default';
  cvName?: string;
}

type JobStatus = 'OPEN' | 'PASSIVE' | 'CLOSED';

// --- CONSTANTS ---
const LOCATIONS = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Cần Thơ', 'Hải Phòng', 'Remote', 'Khác'];
const JOB_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Tự do (Freelance)', 'Thực tập', 'Hợp đồng'];

const SAMPLE_LANGUAGES = ['Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hàn', 'Tiếng Trung', 'Tiếng Pháp', 'Tiếng Đức', 'Tiếng Tây Ban Nha'];
const PROFICIENCY_LEVELS = ['Sơ cấp', 'Giao tiếp cơ bản', 'Giao tiếp chuyên nghiệp', 'Hoàn toàn thành thạo', 'Bản ngữ'];

const MOCK_APPLICATIONS: ApplicationItem[] = [
  { id: 1, title: 'Senior React Engineer', company: 'TechCorp Vietnam', location: 'Hồ Chí Minh', date: '12/10/2023', status: 'Đang xem xét', statusType: 'warning', cvName: 'CV_NguyenVanA_ReactJS.pdf' },
  { id: 2, title: 'Frontend Developer', company: 'ABC Solution', location: 'Hà Nội', date: '01/10/2023', status: 'Từ chối', statusType: 'danger', cvName: 'CV_NguyenVanA_FE.pdf' },
  { id: 3, title: 'UI/UX Designer', company: 'Global Studio', location: 'Remote', date: '28/09/2023', status: 'Phỏng vấn', statusType: 'success', cvName: 'Portfolio_NguyenVanA.pdf' },
];

const SUGGESTED_JOBS = [
  { id: 101, title: 'Lead Frontend Developer', company: 'VinFast', location: 'Hà Nội', salary: '3000$ - 4000$', type: 'Toàn thời gian' },
  { id: 102, title: 'ReactJS Developer (Middle)', company: 'FPT Software', location: 'Hồ Chí Minh', salary: '1500$ - 2500$', type: 'Toàn thời gian' },
  { id: 103, title: 'Freelance Web Designer', company: 'Startup Global', location: 'Remote', salary: 'Thỏa thuận', type: 'Freelance' },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nhà tuyển dụng đã xem hồ sơ',
    description: 'TechCorp Vietnam vừa xem hồ sơ của bạn.',
    time: '30 phút trước',
    icon: Eye,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    isUnread: true
  },
  {
    id: 2,
    title: 'Lời mời phỏng vấn mới',
    description: 'Global Studio đã gửi lời mời phỏng vấn cho vị trí UI/UX Designer.',
    time: '2 giờ trước',
    icon: Calendar,
    color: 'text-green-600',
    bg: 'bg-green-100',
    isUnread: true
  },
  {
    id: 3,
    title: 'Gợi ý việc làm phù hợp',
    description: 'Có 5 việc làm mới phù hợp với kỹ năng ReactJS của bạn.',
    time: '1 ngày trước',
    icon: Sparkles,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    isUnread: false
  }
];

const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; subLabel: string; icon: any; buttonClass: string }> = {
  OPEN: { 
    label: 'Đang tìm việc', 
    subLabel: 'Sẵn sàng nhận việc ngay',
    icon: Globe,
    buttonClass: 'bg-primary-600 text-white border-transparent shadow-lg shadow-primary-200 hover:bg-primary-700' 
  },
  PASSIVE: { 
    label: 'Mở cơ hội mới', 
    subLabel: 'Tham khảo cơ hội tốt hơn',
    icon: Eye,
    buttonClass: 'bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-200 hover:bg-primary-50' 
  },
  CLOSED: { 
    label: 'Đã có việc', 
    subLabel: 'Tạm tắt hồ sơ',
    icon: Lock,
    buttonClass: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200' 
  }
};

export const CandidateDashboard: React.FC = () => {
  const { addToast } = useToast();
  const location = useLocation();

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'applications' | 'saved'>('overview');
  
  // Profile Data States
  const [summary, setSummary] = useState<string>('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>(MOCK_APPLICATIONS);
  
  // Header Profile States
  const [avatar, setAvatar] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>('OPEN');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Modal States
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  
  // Application Action Modals
  const [isViewAppModalOpen, setIsViewAppModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Form States
  const [tempSummary, setTempSummary] = useState('');
  
  const [expForm, setExpForm] = useState<Partial<Experience>>({
    company: '', title: '', type: 'Toàn thời gian', location: '', startDate: '', endDate: '', isCurrent: false, description: ''
  });

  const [langForm, setLangForm] = useState({ name: '', level: 'Giao tiếp chuyên nghiệp' });
  const [skillForm, setSkillForm] = useState({ name: '', rating: 3 });

  // Sync tab from router state
  useEffect(() => {
     const state = location.state as { tab?: string } | null;
     if (state?.tab && ['overview', 'profile', 'applications', 'saved'].includes(state.tab)) {
       setActiveTab(state.tab as any);
     }
  }, [location]);

  // Mock Data for other tabs
  const stats = [
    { label: 'Việc đã ứng tuyển', value: applications.length.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Việc đã lưu', value: '5', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'NTD xem hồ sơ', value: '28', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const savedJobs = [
    { id: 1, title: 'Product Manager', company: 'Vingroup', location: 'Hà Nội', salary: '2000$ - 3000$', posted: '2 ngày trước' },
  ];

  // --- HANDLERS ---
  
  // Avatar Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      addToast('Cập nhật ảnh đại diện thành công', 'success');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Cập nhật thông tin cơ bản thành công!', 'success');
  };

  const handleSaveSummary = () => {
    setSummary(tempSummary);
    setIsSummaryModalOpen(false);
    addToast('Đã cập nhật tóm tắt kinh nghiệm', 'success');
  };

  const handleStatusChange = (status: JobStatus) => {
    setJobStatus(status);
    setIsStatusDropdownOpen(false);
    addToast(`Đã cập nhật trạng thái: ${JOB_STATUS_CONFIG[status].label}`, 'success');
  }

  // Experience Handlers
  const handleSaveExperience = () => {
    if (!expForm.company || !expForm.title || !expForm.startDate) {
      addToast('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
      return;
    }
    const newExp: Experience = {
      id: Date.now(),
      company: expForm.company!,
      title: expForm.title!,
      type: expForm.type || 'Toàn thời gian',
      location: expForm.location || '',
      startDate: expForm.startDate!,
      endDate: expForm.isCurrent ? undefined : expForm.endDate,
      isCurrent: expForm.isCurrent || false,
      description: expForm.description || ''
    };
    setExperiences([newExp, ...experiences]);
    setIsExpModalOpen(false);
    addToast('Đã thêm kinh nghiệm làm việc mới', 'success');
  };

  const handleDeleteExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    addToast('Đã xóa kinh nghiệm làm việc', 'info');
  };

  // Language Handlers
  const openLangModal = () => {
    setLangForm({ name: '', level: 'Giao tiếp chuyên nghiệp' });
    setIsLangModalOpen(true);
  }

  const handleSaveLanguage = () => {
    if (!langForm.name) {
      addToast('Vui lòng chọn ngoại ngữ', 'error');
      return;
    }
    setLanguages([...languages, { id: Date.now(), ...langForm }]);
    setIsLangModalOpen(false);
    addToast('Đã thêm ngoại ngữ', 'success');
  };

  const handleDeleteLanguage = (id: number) => {
    setLanguages(languages.filter(l => l.id !== id));
  }

  // Skill Handlers
  const openSkillModal = () => {
    setSkillForm({ name: '', rating: 3 });
    setIsSkillModalOpen(true);
  }

  const handleSaveSkill = () => {
    if (!skillForm.name) {
      addToast('Vui lòng nhập tên kỹ năng', 'error');
      return;
    }
    setSkills([...skills, { id: Date.now(), ...skillForm }]);
    setIsSkillModalOpen(false);
    addToast('Đã thêm kỹ năng', 'success');
  }

  const handleDeleteSkill = (id: number) => {
    setSkills(skills.filter(s => s.id !== id));
  }
  
  // Application Handlers
  const handleViewApplication = (app: ApplicationItem) => {
    setSelectedApp(app);
    setIsViewAppModalOpen(true);
  };

  const handleWithdrawClick = (app: ApplicationItem) => {
    setSelectedApp(app);
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (selectedApp) {
        setApplications(applications.filter(app => app.id !== selectedApp.id));
        addToast(`Đã rút đơn ứng tuyển vị trí ${selectedApp.title}`, 'info');
        setIsWithdrawModalOpen(false);
        setSelectedApp(null);
    }
  };

  const getStatusColor = (type: string) => {
     switch (type) {
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24 z-30">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
              {/* Avatar Upload */}
              <div className="relative group mb-4">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md overflow-hidden ${avatar ? 'bg-white' : 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600'}`}>
                   {avatar ? (
                     <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                   ) : (
                     "NV"
                   )}
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors text-gray-600 hover:text-primary-600"
                >
                   <Camera className="h-4 w-4" />
                   <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                   />
                </label>
              </div>

              <h2 className="font-bold text-gray-900 text-xl">Nguyễn Văn A</h2>
              <p className="text-gray-500 text-sm font-medium">Software Engineer</p>
              
              {/* Custom Job Status Dropdown */}
              <div className="mt-5 w-full relative">
                 {/* Backdrop to close dropdown */}
                 {isStatusDropdownOpen && (
                   <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)}></div>
                 )}

                 <button
                   onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                   className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${JOB_STATUS_CONFIG[jobStatus].buttonClass}`}
                 >
                    <div className="flex items-center gap-2">
                      {React.createElement(JOB_STATUS_CONFIG[jobStatus].icon, { className: "h-4 w-4" })}
                      {JOB_STATUS_CONFIG[jobStatus].label}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                 </button>

                 {/* Dropdown Menu */}
                 {isStatusDropdownOpen && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1 space-y-0.5">
                        {(Object.keys(JOB_STATUS_CONFIG) as JobStatus[]).map((status) => (
                           <button
                             key={status}
                             onClick={() => handleStatusChange(status)}
                             className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${
                               jobStatus === status ? 'bg-primary-50' : 'hover:bg-gray-50'
                             }`}
                           >
                              <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                jobStatus === status ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 group-hover:border-primary-400'
                              }`}>
                                {jobStatus === status && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                              </div>
                              <div>
                                <div className={`text-sm font-bold ${jobStatus === status ? 'text-primary-700' : 'text-gray-700'}`}>
                                  {JOB_STATUS_CONFIG[status].label}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {JOB_STATUS_CONFIG[status].subLabel}
                                </div>
                              </div>
                           </button>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
                { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
                { id: 'applications', label: 'Việc đã ứng tuyển', icon: Briefcase },
                { id: 'saved', label: 'Việc đã lưu', icon: Heart },
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
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
               <div>
                   <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h1>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`h-7 w-7 ${stat.color}`} />
                          </div>
                        </div>
                      ))}
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity Column */}
                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                              <Bell className="h-5 w-5 text-primary-600" /> Thông báo gần đây
                           </h3>
                           <button className="text-sm text-primary-600 font-medium hover:underline flex items-center">
                              Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                           </button>
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
                  </div>

                  {/* Sidebar / Recommendations */}
                  <div className="space-y-6">
                     {/* Profile Strength */}
                     <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                           <Sparkles className="h-5 w-5 text-yellow-300" /> Hoàn thiện hồ sơ
                        </h3>
                        <p className="text-primary-100 text-sm mb-4">
                           Hồ sơ đầy đủ giúp bạn tăng 70% cơ hội được nhà tuyển dụng liên hệ.
                        </p>
                        <div className="w-full bg-black/20 rounded-full h-2 mb-2">
                           <div className="bg-yellow-400 h-2 rounded-full w-3/4 shadow-sm"></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium mb-4">
                           <span>Đã hoàn thành 75%</span>
                        </div>
                        <Button variant="white" size="sm" className="w-full text-primary-700 hover:bg-gray-50 border-none" onClick={() => setActiveTab('profile')}>
                           Cập nhật ngay
                        </Button>
                     </div>

                     {/* Suggested Jobs */}
                     <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                           <TrendingUp className="h-5 w-5 text-primary-600" /> Việc làm gợi ý
                        </h3>
                        <div className="space-y-3">
                           {SUGGESTED_JOBS.map((job) => (
                              <div key={job.id} className="p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer bg-gray-50/50">
                                 <div className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{job.title}</div>
                                 <div className="text-xs text-gray-500 mb-2">{job.company} • {job.location}</div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-primary-600">{job.salary}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-white">{job.type}</Badge>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-primary-600 hover:bg-primary-50 text-sm">
                           Xem thêm gợi ý
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* 1. Basic Info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary-600"/> Thông tin cơ bản
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" defaultValue="Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chức danh (Title)</label>
                      <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" defaultValue="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" defaultValue="nguyenvana@example.com" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input type="tel" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" defaultValue="0901234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                      <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" defaultValue="1995-06-15" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" defaultValue="Quận 1, TP. Hồ Chí Minh" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
                       <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="Viết ngắn gọn về kinh nghiệm và mục tiêu nghề nghiệp của bạn..."></textarea>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" size="sm">Lưu thông tin</Button>
                  </div>
                </div>

                {/* 2. Summary (Tóm tắt) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <FileText className="h-5 w-5 text-primary-600"/> Tóm tắt
                     </h2>
                     <button type="button" onClick={() => {setTempSummary(summary); setIsSummaryModalOpen(true)}} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                       <Pencil className="h-4 w-4" />
                     </button>
                  </div>
                  
                  {summary ? (
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{summary}</p>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <FileText className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm italic">Chưa có thông tin tóm tắt kinh nghiệm</p>
                    </div>
                  )}
                </div>

                {/* 3. Experience (Kinh nghiệm) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Briefcase className="h-5 w-5 text-primary-600"/> Kinh nghiệm
                     </h2>
                     <button type="button" onClick={() => {
                        setExpForm({ company: '', title: '', type: 'Toàn thời gian', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });
                        setIsExpModalOpen(true);
                     }} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                       <Plus className="h-5 w-5" />
                     </button>
                  </div>

                  {experiences.length > 0 ? (
                    <div className="space-y-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="relative group pl-6 border-l-2 border-gray-100 last:border-0">
                           <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-primary-600 ring-4 ring-white"></div>
                           <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                               <div className="text-gray-600 font-medium">{exp.company}</div>
                               <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                  <span>{exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}</span>
                                  <span>•</span>
                                  <span>{exp.location}</span>
                               </div>
                               <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg inline-block">
                                 {exp.type}
                               </p>
                             </div>
                             <button 
                               type="button"
                               onClick={() => handleDeleteExperience(exp.id)}
                               className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                             >
                               <Trash2 className="h-4 w-4" />
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                       <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <Briefcase className="h-8 w-8 text-gray-300" />
                       </div>
                       <p className="text-gray-400 text-sm italic mb-4">Thêm kinh nghiệm làm việc để giúp nhà tuyển dụng hiểu hơn về bạn</p>
                       <Button type="button" variant="outline" onClick={() => setIsExpModalOpen(true)} className="border-dashed border-primary-300 text-primary-600 hover:bg-primary-50">
                          + Thêm kinh nghiệm
                       </Button>
                    </div>
                  )}
                </div>

                {/* 4. Languages (Ngoại ngữ) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Languages className="h-5 w-5 text-primary-600"/> Ngoại ngữ
                     </h2>
                     <button type="button" onClick={openLangModal} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                       <Plus className="h-5 w-5" />
                     </button>
                  </div>

                  {languages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {languages.map((lang) => (
                         <div key={lang.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm font-bold text-xs">
                                  {lang.name.substring(0, 2).toUpperCase()}
                               </div>
                               <div>
                                  <div className="font-bold text-gray-900">{lang.name}</div>
                                  <div className="text-xs text-gray-500">{lang.level}</div>
                               </div>
                            </div>
                            <button type="button" onClick={() => handleDeleteLanguage(lang.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Trash2 className="h-4 w-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                       <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <Languages className="h-8 w-8 text-gray-300" />
                       </div>
                       <p className="text-gray-400 text-sm italic mb-4">Bạn biết những ngoại ngữ nào? Hãy thêm vào để tăng độ "hot" cho hồ sơ nhé.</p>
                       <Button type="button" variant="outline" onClick={openLangModal} className="border-dashed border-primary-300 text-primary-600 hover:bg-primary-50">
                          + Thêm ngoại ngữ
                       </Button>
                    </div>
                  )}
                </div>

                {/* 5. Skills (Kỹ năng) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Zap className="h-5 w-5 text-primary-600"/> Kỹ năng / Công cụ
                     </h2>
                     <button type="button" onClick={openSkillModal} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                       <Plus className="h-5 w-5" />
                     </button>
                  </div>

                  {skills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                       {skills.map((skill) => (
                         <div key={skill.id} className="relative p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all group">
                            <div className="flex justify-between items-start mb-2">
                               <div className="font-medium text-gray-900">{skill.name}</div>
                               <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="text-gray-300 hover:text-red-500">
                                  <X className="h-3.5 w-3.5" />
                               </button>
                            </div>
                            <div className="flex gap-1">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star 
                                   key={star} 
                                   className={`h-3.5 w-3.5 ${star <= skill.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                                 />
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                       <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <Zap className="h-8 w-8 text-gray-300" />
                       </div>
                       <p className="text-gray-400 text-sm italic mb-4">Kỹ năng / công cụ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.</p>
                       <Button type="button" variant="outline" onClick={openSkillModal} className="border-dashed border-primary-300 text-primary-600 hover:bg-primary-50">
                          + Thêm kỹ năng
                       </Button>
                    </div>
                  )}
                </div>

                {/* 6. CV Upload */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                   <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-600"/> CV / Hồ sơ năng lực
                  </h2>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer group">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                         <Upload className="h-8 w-8 text-gray-400 group-hover:text-primary-600" />
                      </div>
                      <h4 className="text-gray-900 font-medium mb-1">Tải lên CV của bạn</h4>
                      <p className="text-sm text-gray-500 mb-4">Hỗ trợ định dạng PDF, DOCX (Tối đa 5MB)</p>
                      <Button type="button" variant="outline" size="sm">Chọn tệp tin</Button>
                   </div>
                   
                   <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                         <FileText className="h-8 w-8 text-red-500" />
                         <div>
                            <p className="text-sm font-medium text-gray-900">CV_NguyenVanA_2024.pdf</p>
                            <p className="text-xs text-gray-500">Đã tải lên ngày 10/10/2023</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <Button type="button" variant="ghost" size="sm" className="text-blue-600">Xem</Button>
                         <Button type="button" variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                   </div>
                </div>

              </form>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Việc làm đã ứng tuyển</h1>
              
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs tracking-wider">
                       <tr>
                         <th className="px-6 py-4">Công việc</th>
                         <th className="px-6 py-4">Ngày nộp</th>
                         <th className="px-6 py-4">Trạng thái</th>
                         <th className="px-6 py-4 text-right">Thao tác</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                     <Building2 className="h-5 w-5" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-gray-900 text-sm">{app.title}</div>
                                     <div className="text-xs text-gray-500 flex items-center gap-1">
                                        {app.company} • {app.location}
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                               <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  {app.date}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.statusType)}`}>
                                  {app.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-600 hover:bg-blue-50"
                                    onClick={() => handleViewApplication(app)}
                                  >
                                    Xem
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleWithdrawClick(app)}
                                  >
                                    Từ chối
                                  </Button>
                               </div>
                            </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                 </div>
                 {applications.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                       Chưa có đơn ứng tuyển nào.
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* SAVED JOBS TAB */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
               <h1 className="text-2xl font-bold text-gray-900">Việc làm đã lưu</h1>
               
               <div className="grid grid-cols-1 gap-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                          <div className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                             <Building2 className="h-7 w-7" />
                          </div>
                          <div>
                             <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                             <p className="text-gray-600 text-sm font-medium mb-2">{job.company}</p>
                             <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                                <span className="flex items-center gap-1 text-green-600 font-medium"><span className="text-gray-400">$</span> {job.salary}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.posted}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 flex-1 md:flex-none">
                             <Trash2 className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Bỏ lưu</span>
                             <span className="md:hidden">Xóa</span>
                          </Button>
                          <Button size="sm" className="flex-1 md:flex-none">Ứng tuyển ngay</Button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>

      {/* --- MODALS --- */}

      {/* View Application Modal */}
      {isViewAppModalOpen && selectedApp && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
               <div className="flex gap-4">
                   <div className="h-14 w-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-500">
                      <Building2 className="h-7 w-7" />
                   </div>
                   <div>
                       <h3 className="font-bold text-xl text-gray-900">{selectedApp.title}</h3>
                       <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <span className="font-medium">{selectedApp.company}</span>
                          <span>•</span>
                          <span>{selectedApp.location}</span>
                       </div>
                   </div>
               </div>
               <button onClick={() => setIsViewAppModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-5 w-5" />
               </button>
             </div>
             <div className="p-6">
                {/* Status Timeline (Simplified) */}
                <div className="mb-8">
                   <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase">Trạng thái hồ sơ</h4>
                   <div className="relative pl-4 border-l-2 border-primary-200 space-y-6">
                      <div className="relative">
                         <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full bg-primary-600 border-2 border-white"></div>
                         <div className="text-sm font-bold text-gray-900">Đã nộp hồ sơ</div>
                         <div className="text-xs text-gray-500">{selectedApp.date}</div>
                      </div>
                      <div className="relative">
                         <div className={`absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-white ${selectedApp.statusType !== 'default' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                         <div className={`text-sm font-bold ${selectedApp.statusType !== 'default' ? 'text-gray-900' : 'text-gray-400'}`}>
                             {selectedApp.status}
                         </div>
                         {selectedApp.statusType !== 'default' && <div className="text-xs text-gray-500">Cập nhật mới nhất</div>}
                      </div>
                   </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                         <FileText className="h-4 w-4 text-primary-600" /> CV đã nộp
                      </h4>
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                         <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{selectedApp.cvName || 'CV_Profile.pdf'}</span>
                         </div>
                         <Button variant="ghost" size="sm" className="text-primary-600"><Download className="h-4 w-4"/></Button>
                      </div>
                   </div>

                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                         <User className="h-4 w-4 text-primary-600" /> Thông tin liên hệ
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                         <div className="flex justify-between">
                            <span>Email:</span>
                            <span className="font-medium text-gray-900">nguyenvana@example.com</span>
                         </div>
                         <div className="flex justify-between">
                            <span>SĐT:</span>
                            <span className="font-medium text-gray-900">0901234567</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="p-6 pt-0 flex justify-end">
               <Button onClick={() => setIsViewAppModalOpen(false)}>Đóng</Button>
             </div>
           </div>
         </div>
      )}

      {/* Withdraw/Reject Confirmation Modal */}
      {isWithdrawModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-100 transition-all">
              <div className="p-6 text-center">
                 <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Rút đơn ứng tuyển?</h3>
                 <p className="text-gray-500 mb-6">
                    Bạn có chắc chắn muốn rút hồ sơ ứng tuyển cho vị trí <span className="font-bold text-gray-900">{selectedApp.title}</span> tại <span className="font-bold text-gray-900">{selectedApp.company}</span> không? Hành động này không thể hoàn tác.
                 </p>
                 <div className="flex gap-3 justify-center">
                    <Button variant="secondary" onClick={() => setIsWithdrawModalOpen(false)} className="w-full">Hủy bỏ</Button>
                    <Button variant="danger" onClick={handleConfirmWithdraw} className="w-full bg-red-600 text-white hover:bg-red-700">Xác nhận rút đơn</Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Summary Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg text-gray-900">Chỉnh sửa tóm tắt</h3>
               <button onClick={() => setIsSummaryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-5 w-5" />
               </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới thiệu ngắn gọn về kinh nghiệm và mục tiêu nghề nghiệp của bạn
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all min-h-[150px]"
                value={tempSummary}
                onChange={(e) => setTempSummary(e.target.value)}
                placeholder="Ví dụ: Tôi là một lập trình viên React với 5 năm kinh nghiệm..."
              ></textarea>
            </div>
            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsSummaryModalOpen(false)}>Hủy bỏ</Button>
              <Button onClick={handleSaveSummary}>Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg text-gray-900">Thêm kinh nghiệm làm việc</h3>
               <button onClick={() => setIsExpModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-5 w-5" />
               </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Công ty <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    placeholder="Ví dụ: Google, Facebook, Apple..."
                    value={expForm.company}
                    onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức danh <span className="text-red-500">*</span></label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                   <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    placeholder="Ví dụ: Trưởng phòng nhân sự"
                    value={expForm.title}
                    onChange={(e) => setExpForm({...expForm, title: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình làm việc <span className="text-red-500">*</span></label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 bg-white"
                  value={expForm.type}
                  onChange={(e) => setExpForm({...expForm, type: e.target.value})}
                >
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                 <input 
                   type="checkbox" 
                   id="isCurrent"
                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                   checked={expForm.isCurrent}
                   onChange={(e) => setExpForm({...expForm, isCurrent: e.target.checked})}
                 />
                 <label htmlFor="isCurrent" className="text-sm text-gray-700">Hiện tại đang làm việc ở đây</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu làm việc từ <span className="text-red-500">*</span></label>
                    <input 
                      type="month" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                      value={expForm.startDate}
                      onChange={(e) => setExpForm({...expForm, startDate: e.target.value})}
                    />
                 </div>
                 {!expForm.isCurrent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                      <input 
                        type="month" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                        value={expForm.endDate}
                        onChange={(e) => setExpForm({...expForm, endDate: e.target.value})}
                      />
                    </div>
                 )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nơi làm việc</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                   <select 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 bg-white appearance-none"
                      value={expForm.location}
                      onChange={(e) => setExpForm({...expForm, location: e.target.value})}
                    >
                      <option value="">Chọn địa điểm</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 min-h-[100px]"
                  placeholder="Mô tả trách nhiệm, thành tựu bạn đã đạt được trong công việc này"
                  value={expForm.description}
                  onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="p-6 pt-4 flex justify-between bg-gray-50">
               <Button variant="ghost" onClick={() => setIsExpModalOpen(false)}>
                 <X className="h-4 w-4 mr-2" /> Để sau
               </Button>
               <Button onClick={handleSaveExperience} className="bg-orange-500 hover:bg-orange-600 text-white">
                 Thêm <Plus className="h-4 w-4 ml-1" />
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg text-gray-900">Thêm ngoại ngữ</h3>
               <button onClick={() => setIsLangModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-5 w-5" />
               </button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngoại ngữ</label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 bg-white appearance-none"
                      value={langForm.name}
                      onChange={(e) => setLangForm({...langForm, name: e.target.value})}
                    >
                      <option value="">Chọn ngoại ngữ</option>
                      {SAMPLE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 bg-white appearance-none"
                      value={langForm.level}
                      onChange={(e) => setLangForm({...langForm, level: e.target.value})}
                    >
                      {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
               </div>
             </div>
             <div className="p-6 pt-0 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsLangModalOpen(false)}>Hủy bỏ</Button>
              <Button onClick={handleSaveLanguage} className="bg-orange-500 hover:bg-orange-600 text-white">Thêm <Plus className="h-4 w-4 ml-1"/></Button>
            </div>
           </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg text-gray-900">Thêm kỹ năng</h3>
               <button onClick={() => setIsSkillModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-5 w-5" />
               </button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ năng</label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                      placeholder="Ví dụ: Microsoft Excel..."
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thành thạo</label>
                  <div className="flex gap-2 mt-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button 
                         key={star}
                         type="button"
                         onClick={() => setSkillForm({...skillForm, rating: star})}
                         className="focus:outline-none transform transition-transform hover:scale-110"
                       >
                         <Star 
                           className={`h-8 w-8 ${star <= skillForm.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} 
                         />
                       </button>
                     ))}
                  </div>
               </div>
             </div>
             <div className="p-6 pt-0 flex justify-between">
              <Button variant="ghost" onClick={() => setIsSkillModalOpen(false)}>
                 <X className="h-4 w-4 mr-2" /> Để sau
               </Button>
              <Button onClick={handleSaveSkill} className="bg-orange-500 hover:bg-orange-600 text-white">Thêm <Plus className="h-4 w-4 ml-1"/></Button>
            </div>
           </div>
        </div>
      )}

    </div>
  );
};