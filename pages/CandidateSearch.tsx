import React, { useState } from 'react';
import { 
  Search, MapPin, Briefcase, Filter, X, ChevronDown, 
  Star, User, Download, Lock, GraduationCap, Eye,
  Layers, DollarSign, CheckSquare, Clock, Globe, Calendar,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Role } from '../types';
import { Link } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

interface CandidateSearchProps {
  currentRole: Role;
}

// --- MOCK DATA ---
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    title: 'Senior React Engineer',
    avatar: null, // null will show initials
    location: 'Hà Nội',
    experience: '5 năm',
    salaryExpectation: '2000$ - 3000$',
    skills: ['Gained over 300 online orders within two months', 'Orchestrated a brand awareness campaign', 'Negotiated exclusive agency agreements', 'Proficient in ReactJS & Node.js'],
    updatedAt: '4 giờ trước',
    isOpenToWork: true,
    education: 'Đại học Bách Khoa TP.HCM',
    industry: 'IT / Phần mềm',
    age: 28,
    languages: 'English - Giao tiếp chuyên nghiệp'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    title: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Hồ Chí Minh',
    experience: '3 năm',
    salaryExpectation: '15 - 20 Triệu',
    skills: ['Designed 50+ mobile app interfaces', 'Increased user retention by 20%', 'Expert in Figma & Adobe XD'],
    updatedAt: '1 ngày trước',
    isOpenToWork: true,
    education: 'Đại học Mỹ Thuật Công Nghiệp',
    industry: 'Thiết kế',
    age: 25,
    languages: 'English - IELTS 6.5'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    title: 'Fullstack Developer',
    avatar: null,
    location: 'Đà Nẵng',
    experience: '4 năm',
    salaryExpectation: 'Thỏa thuận',
    skills: ['Built scalable microservices', 'Optimized database queries reducing load by 40%', 'Mentored 3 junior developers'],
    updatedAt: '3 ngày trước',
    isOpenToWork: false,
    education: 'Đại học Duy Tân',
    industry: 'IT / Phần mềm',
    age: 27,
    languages: 'English - Đọc hiểu tài liệu'
  },
  {
    id: 4,
    name: 'Phạm Minh D',
    title: 'Digital Marketing Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Hồ Chí Minh',
    experience: '6 năm',
    salaryExpectation: '30 - 40 Triệu',
    skills: ['Managed 50k$ monthly ad budget', 'Grew organic traffic by 150%', 'Led a team of 5 marketers'],
    updatedAt: '5 giờ trước',
    isOpenToWork: true,
    education: 'Đại học Kinh Tế TP.HCM',
    industry: 'Marketing / Truyền thông',
    age: 30,
    languages: 'English - Business Level'
  },
  {
    id: 5,
    name: 'Hoàng Thị E',
    title: 'Human Resources Manager',
    avatar: null,
    location: 'Hà Nội',
    experience: '8 năm',
    salaryExpectation: 'Trên 40 Triệu',
    skills: ['Implemented new HRIS system', 'Reduced turnover rate by 15%', 'Structured company-wide salary grades'],
    updatedAt: '1 tuần trước',
    isOpenToWork: true,
    education: 'Đại học Luật Hà Nội',
    industry: 'Hành chính / Nhân sự',
    age: 34,
    languages: 'English, Japanese N3'
  },
  {
    id: 6,
    name: 'Đặng Văn F',
    title: 'Mobile Developer (Flutter)',
    avatar: null,
    location: 'Remote',
    experience: '2 năm',
    salaryExpectation: '1000$ - 1500$',
    skills: ['Published 5 apps to Store', 'Implemented CI/CD pipelines', 'Clean Architecture expertise'],
    updatedAt: '2 ngày trước',
    isOpenToWork: true,
    education: 'FPT University',
    industry: 'IT / Phần mềm',
    age: 24,
    languages: 'English - Intermediate'
  }
];

const LOCATIONS = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Remote'];
const INDUSTRIES = ['IT / Phần mềm', 'Marketing / Truyền thông', 'Kinh doanh / Bán hàng', 'Hành chính / Nhân sự', 'Thiết kế', 'Tài chính / Kế toán'];
const EXP_RANGES = ['Dưới 1 năm', '1 - 3 năm', '3 - 5 năm', 'Trên 5 năm'];
const SALARY_RANGES = ['Thỏa thuận', 'Dưới 10 Triệu', '10 - 20 Triệu', '20 - 50 Triệu', 'Trên 50 Triệu', 'USD (Ngoại tệ)'];

export const CandidateSearch: React.FC<CandidateSearchProps> = ({ currentRole }) => {
  const { addToast } = useToast();
  // Search Bar State
  const [keyword, setKeyword] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');

  // Sidebar Filters State
  const [expFilter, setExpFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string>('Tất cả mức lương');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Authorization Check
  const isAuthorized = currentRole === Role.EMPLOYER || currentRole === Role.ADMIN;

  // Mask Name Helper
  const getDisplayName = (name: string) => {
      if (isAuthorized) return name;
      const parts = name.split(' ');
      if (parts.length > 1) {
          // E.g., Nguyen Van A -> Nguyen V** *
          const lastName = parts[0];
          const middle = parts.slice(1, parts.length - 1).map(p => p[0]).join('');
          return `${lastName} ${middle}***`;
      }
      return name.substring(0, 3) + '***';
  }

  // Helpers for checkboxes
  const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const clearFilters = () => {
    setExpFilter([]);
    setSalaryFilter('Tất cả mức lương');
    setKeyword('');
    setLocationSearch('');
    setIndustrySearch('');
  };

  // Filter Logic
  const filteredCandidates = MOCK_CANDIDATES.filter(c => {
    // 1. Keyword
    const matchKeyword = keyword === '' || 
                         c.name.toLowerCase().includes(keyword.toLowerCase()) || 
                         c.title.toLowerCase().includes(keyword.toLowerCase()) ||
                         c.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
    
    // 2. Location & Industry (Search Bar)
    const matchLocation = locationSearch === '' || locationSearch === 'Toàn quốc' || c.location === locationSearch;
    const matchIndustry = industrySearch === '' || c.industry === industrySearch; // Simple match for demo
    
    // 3. Experience (Sidebar Checkbox)
    let matchExp = true;
    if (expFilter.length > 0) {
       const expNum = parseInt(c.experience);
       const matchesAny = expFilter.some(range => {
          if (range === 'Dưới 1 năm') return expNum < 1;
          if (range === '1 - 3 năm') return expNum >= 1 && expNum <= 3;
          if (range === '3 - 5 năm') return expNum > 3 && expNum <= 5;
          if (range === 'Trên 5 năm') return expNum > 5;
          return false;
       });
       matchExp = matchesAny;
    }

    // 4. Salary (Sidebar Radio)
    const matchSalary = salaryFilter === 'Tất cả mức lương' || true;

    return matchKeyword && matchLocation && matchIndustry && matchExp && matchSalary;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-primary-700 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Tìm kiếm nhân tài</h1>
          <p className="text-primary-100">Kết nối với hơn 100,000+ ứng viên tiềm năng cho doanh nghiệp của bạn</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-white"
                onClick={() => setIsMobileFilterOpen(true)}
                >
                <Filter className="h-4 w-4" /> Bộ lọc tìm kiếm
                </Button>
            </div>

            {/* Sidebar Filters */}
            <div className={`
                fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:p-0 lg:z-0 lg:block overflow-y-auto lg:overflow-visible
                ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className="font-bold text-lg">Bộ lọc</h3>
                    <button onClick={() => setIsMobileFilterOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6 sticky top-24">
                     {/* 2. Experience */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Briefcase className="h-4 w-4 text-primary-600"/> Kinh nghiệm
                        </h3>
                        <div className="space-y-2.5">
                            {EXP_RANGES.map(exp => (
                                <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all"
                                        checked={expFilter.includes(exp)}
                                        onChange={() => toggleFilter(expFilter, setExpFilter, exp)}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{exp}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* 3. Salary Expectation */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <DollarSign className="h-4 w-4 text-primary-600"/> Mức lương mong muốn
                        </h3>
                        <div className="space-y-2.5">
                        {SALARY_RANGES.map(range => (
                            <label key={range} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="salary_candidate"
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={salaryFilter === range}
                                onChange={() => setSalaryFilter(range)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{range}</span>
                            </label>
                        ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" className="w-full text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200" size="sm" onClick={clearFilters}>
                            Xóa tất cả bộ lọc
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                 {/* Search Bar */}
                 <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 sticky top-20 z-10">
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 items-center">
                        <div className="relative flex-grow-[2] group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên, chức danh, kỹ năng..." 
                                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 placeholder-gray-500"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="relative flex-1 md:min-w-[180px] group w-full">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <select 
                                className="w-full pl-12 pr-8 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 appearance-none cursor-pointer truncate"
                                value={industrySearch}
                                onChange={(e) => setIndustrySearch(e.target.value)}
                            >
                                <option value="">Tất cả lĩnh vực</option>
                                {INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 md:min-w-[180px] group w-full">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <select 
                                className="w-full pl-12 pr-8 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 appearance-none cursor-pointer truncate"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                            >
                                <option value="">Tất cả địa điểm</option>
                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="w-full md:w-auto p-1 md:p-0 md:pl-2 flex-shrink-0">
                            <Button size="lg" className="w-full md:w-auto px-6 rounded-lg shadow-sm text-base whitespace-nowrap">
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-gray-700 font-medium">
                        Tìm thấy <span className="font-bold text-gray-900">{filteredCandidates.length}</span> ứng viên phù hợp
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 hidden sm:inline">Sắp xếp theo:</span>
                        <select className="text-sm border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer">
                            <option>Cập nhật mới nhất</option>
                            <option>Kinh nghiệm giảm dần</option>
                            <option>Liên quan nhất</option>
                        </select>
                    </div>
                </div>

                {/* --- CANDIDATES LIST (Horizontal) --- */}
                
                <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                        <div key={candidate.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                            {/* Mobile Header (Only visible on small screens) */}
                            <div className="md:hidden p-4 border-b border-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Cập nhật {candidate.updatedAt}</span>
                                {isAuthorized ? <Star className="h-5 w-5 text-gray-300" /> : <Lock className="h-4 w-4 text-gray-300" />}
                            </div>

                            <div className="flex flex-col md:flex-row">
                                {/* Column 1: Basic Info */}
                                <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start gap-3 mb-2">
                                            <div>
                                                <h3 className={`font-bold text-lg text-gray-900 ${isAuthorized ? 'cursor-pointer hover:text-primary-600' : ''}`}>
                                                    {getDisplayName(candidate.name)}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">Được chia sẻ vào {candidate.updatedAt}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                {candidate.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                {candidate.age} tuổi
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {isAuthorized ? (
                                            <Button variant="outline" className="w-full border-dashed border-primary-200 text-primary-600 hover:bg-primary-50">
                                                <Download className="h-4 w-4 mr-2" /> Tải hồ sơ
                                            </Button>
                                        ) : (
                                            <Link to="/login" className="block">
                                                <Button variant="outline" className="w-full text-xs border-dashed text-gray-500 hover:text-primary-600 hover:border-primary-200">
                                                    <Download className="h-3 w-3 mr-2" /> Tải hồ sơ
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Column 2: Details */}
                                <div className="p-6 md:w-2/5 border-b md:border-b-0 md:border-r border-gray-100">
                                    <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
                                        <div className="text-gray-400">Lĩnh vực</div>
                                        <div className="font-medium text-gray-900">{candidate.industry}</div>

                                        <div className="text-gray-400">Vị trí ứng tuyển</div>
                                        <div>
                                            <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 font-medium px-2 py-0.5">
                                                {candidate.title}
                                            </Badge>
                                        </div>

                                        <div className="text-gray-400">Số năm kinh nghiệm</div>
                                        <div className="font-medium text-gray-900">{candidate.experience}</div>

                                        <div className="text-gray-400">Ngoại ngữ</div>
                                        <div className="bg-gray-50 px-2 py-1 rounded inline-block text-gray-700 text-xs border border-gray-100">
                                            {candidate.languages}
                                        </div>

                                        <div className="text-gray-400">Mức lương kỳ vọng</div>
                                        <div 
                                            className="text-primary-600 font-bold cursor-pointer hover:underline"
                                            onClick={() => {
                                                if (!isAuthorized) {
                                                    addToast('Vui lòng đăng nhập tài khoản Nhà tuyển dụng để xem mức lương', 'info');
                                                }
                                            }}
                                        >
                                            {isAuthorized ? candidate.salaryExpectation : 'Xem mức lương'}
                                        </div>

                                        <div className="text-gray-400">Thời gian bắt đầu</div>
                                        <div className="text-gray-900">30 ngày</div>
                                    </div>
                                </div>

                                {/* Column 3: Highlights */}
                                <div className="p-6 md:w-1/3 bg-gray-50/30">
                                    <ul className="space-y-2">
                                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{skill}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <button className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium">
                                            Xem thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCandidates.length === 0 && (
                     <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                        <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                           <User className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy ứng viên phù hợp</h3>
                        <p className="text-gray-500 mt-1">Thử thay đổi từ khóa hoặc mở rộng phạm vi tìm kiếm của bạn.</p>
                        <Button variant="outline" className="mt-4" onClick={clearFilters}>Xóa bộ lọc</Button>
                     </div>
                )}
                
                {filteredCandidates.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Trước</Button>
                        <Button variant="primary" size="sm" className="bg-primary-600 text-white">1</Button>
                        <Button variant="ghost" size="sm">2</Button>
                        <Button variant="ghost" size="sm">3</Button>
                        <span className="text-gray-400">...</span>
                        <Button variant="outline" size="sm">Sau</Button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};