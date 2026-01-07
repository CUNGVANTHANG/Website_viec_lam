import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Building2, Filter, X, Briefcase, Monitor, Layers, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Job, JobType } from '../types';
import { Link } from 'react-router-dom';

// Extended Mock Data
const MOCK_JOBS_DATA: Job[] = [
  {
    id: '1',
    title: 'Senior React Engineer',
    company: 'TechCorp Vietnam',
    location: 'Hồ Chí Minh',
    salary: '2500$ - 3500$',
    type: JobType.FULL_TIME,
    postedAt: '2 giờ trước',
    description: '',
    requirements: []
  },
  {
    id: '2',
    title: 'Digital Marketing Specialist',
    company: 'Creative Agency',
    location: 'Hà Nội',
    salary: '15 - 20 Triệu',
    type: JobType.FULL_TIME,
    postedAt: '1 ngày trước',
    description: '',
    requirements: []
  },
  {
    id: '3',
    title: 'Freelance Graphic Designer',
    company: 'Global Studio',
    location: 'Remote',
    salary: 'Thỏa thuận',
    type: JobType.FREELANCE,
    postedAt: '3 ngày trước',
    description: '',
    requirements: []
  },
  {
    id: '4',
    title: 'Backend Developer (Node.js)',
    company: 'Fintech Solution',
    location: 'Đà Nẵng',
    salary: '2000$ - 3000$',
    type: JobType.FULL_TIME,
    postedAt: '5 giờ trước',
    description: '',
    requirements: []
  },
  {
    id: '5',
    title: 'HR Manager',
    company: 'Logistics Pro',
    location: 'Hồ Chí Minh',
    salary: '25 - 35 Triệu',
    type: JobType.FULL_TIME,
    postedAt: '1 ngày trước',
    description: '',
    requirements: []
  },
  {
    id: '6',
    title: 'Sales Executive',
    company: 'Real Estate Group',
    location: 'Hà Nội',
    salary: '10 - 15 Triệu + HH',
    type: JobType.FULL_TIME,
    postedAt: '2 ngày trước',
    description: '',
    requirements: []
  },
  {
    id: '7',
    title: 'AI Engineer',
    company: 'Future Tech',
    location: 'Hồ Chí Minh',
    salary: '3000$ - 5000$',
    type: JobType.FULL_TIME,
    postedAt: '3 giờ trước',
    description: '',
    requirements: []
  },
  {
    id: '8',
    title: 'Content Writer',
    company: 'Media House',
    location: 'Remote',
    salary: '8 - 12 Triệu',
    type: JobType.PART_TIME,
    postedAt: '4 ngày trước',
    description: '',
    requirements: []
  },
  {
    id: '9',
    title: 'Giám đốc kinh doanh vùng',
    company: 'FMCG Corp',
    location: 'Toàn quốc',
    salary: '40 - 60 Triệu',
    type: JobType.FULL_TIME,
    postedAt: '1 tuần trước',
    description: '',
    requirements: []
  },
  {
    id: '10',
    title: 'Kỹ sư vận hành máy',
    company: 'Manufacturing VN',
    location: 'Bình Dương',
    salary: '12 - 18 Triệu',
    type: JobType.FULL_TIME,
    postedAt: '2 ngày trước',
    description: '',
    requirements: []
  }
];

// Constants for Filters
const LOCATIONS = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Cần Thơ', 'Hải Phòng', 'Remote'];
const JOB_TYPES = Object.values(JobType); // Full-time, Part-time...
const WORK_MODES = ['Tại văn phòng', 'Remote (Từ xa)', 'Hybrid (Linh hoạt)'];
const SALARY_RANGES = ['Tất cả mức lương', 'Dưới 10 triệu', '10 - 20 triệu', '20 - 50 triệu', 'Trên 50 triệu', 'Thỏa thuận'];
const INDUSTRIES = ['IT / Phần mềm', 'Marketing / Truyền thông', 'Kinh doanh / Bán hàng', 'Hành chính / Nhân sự', 'Tài chính / Kế toán', 'Sản xuất / Vận hành'];

export const JobList: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [industrySearch, setIndustrySearch] = useState(''); // New state for search bar industry
  
  // Sidebar Filters State
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [workModeFilter, setWorkModeFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string>('Tất cả mức lương');
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter Logic
  const filteredJobs = MOCK_JOBS_DATA.filter(job => {
    // 1. Keyword
    const matchKeyword = keyword === '' || 
                         job.title.toLowerCase().includes(keyword.toLowerCase()) || 
                         job.company.toLowerCase().includes(keyword.toLowerCase());
    
    // 2. Location (from Search Bar)
    const matchLocation = locationFilter === '' || 
                          locationFilter === 'Toàn quốc' ||
                          job.location.includes(locationFilter) ||
                          (locationFilter === 'Remote' && job.location === 'Remote');

    // 2.1 Industry (from Search Bar)
    // Note: In a real app, you would check job.industry. Here we assume true or partial match if we had the data
    const matchIndustrySearch = industrySearch === '' || true; 

    // 3. Job Type (Hình thức) - Checkbox logic (OR)
    const matchType = jobTypeFilter.length === 0 || jobTypeFilter.includes(job.type);

    // 4. Work Mode (Loại hình)
    const matchWorkMode = workModeFilter.length === 0 || (
       (workModeFilter.includes('Remote (Từ xa)') && job.location === 'Remote') ||
       (workModeFilter.includes('Tại văn phòng') && job.location !== 'Remote')
    );

    // 6. Salary
    const matchSalary = salaryFilter === 'Tất cả mức lương' || true;

    return matchKeyword && matchLocation && matchIndustrySearch && matchType && matchWorkMode && matchSalary;
  });

  const clearFilters = () => {
    setJobTypeFilter([]);
    setWorkModeFilter([]);
    setSalaryFilter('Tất cả mức lương');
    setKeyword('');
    setLocationFilter('');
    setIndustrySearch('');
  };

  const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-primary-700 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Tìm kiếm công việc mơ ước</h1>
          <p className="text-primary-100">Hơn 5,000+ cơ hội việc làm đang chờ đón bạn</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-white"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" /> Bộ lọc tìm kiếm
            </Button>
          </div>

          {/* Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:p-0 lg:z-0 lg:block overflow-y-auto lg:overflow-visible
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
             <div className="flex justify-between items-center mb-6 lg:hidden">
               <h3 className="font-bold text-lg">Bộ lọc</h3>
               <button onClick={() => setIsMobileFiltersOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6 sticky top-24">
               
               {/* 1. Hình thức (Job Type) */}
               <div>
                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <Briefcase className="h-4 w-4 text-primary-600"/> Hình thức
                 </h3>
                 <div className="space-y-2.5">
                   {JOB_TYPES.map(type => (
                     <label key={type} className="flex items-center gap-3 cursor-pointer group">
                       <div className="relative flex items-center">
                         <input 
                            type="checkbox" 
                            className="peer h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all"
                            checked={jobTypeFilter.includes(type)}
                            onChange={() => toggleFilter(jobTypeFilter, setJobTypeFilter, type)}
                         />
                       </div>
                       <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{type}</span>
                     </label>
                   ))}
                 </div>
               </div>

               <div className="border-t border-gray-100"></div>

               {/* 2. Loại hình (Work Mode) */}
               <div>
                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <Monitor className="h-4 w-4 text-primary-600"/> Loại hình
                 </h3>
                 <div className="space-y-2.5">
                   {WORK_MODES.map(mode => (
                     <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                       <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={workModeFilter.includes(mode)}
                          onChange={() => toggleFilter(workModeFilter, setWorkModeFilter, mode)}
                       />
                       <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{mode}</span>
                     </label>
                   ))}
                 </div>
               </div>

               <div className="border-t border-gray-100"></div>

               {/* 3. Mức lương (Salary) */}
               <div>
                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <DollarSign className="h-4 w-4 text-primary-600"/> Mức lương
                 </h3>
                 <div className="space-y-2.5">
                   {SALARY_RANGES.map(range => (
                     <label key={range} className="flex items-center gap-3 cursor-pointer group">
                       <input 
                          type="radio" 
                          name="salary"
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

          {/* Job List Content */}
          <div className="lg:col-span-3">
             {/* Unified Search Bar with Industry and Location */}
             <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 sticky top-20 z-10">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 items-center">
                   {/* Keyword Input */}
                   <div className="relative flex-grow-[2] group w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm công việc, công ty..." 
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 placeholder-gray-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                   </div>

                   {/* Industry Select (New) */}
                   <div className="relative flex-1 md:min-w-[200px] group w-full">
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

                   {/* Location Select */}
                   <div className="relative flex-1 md:min-w-[200px] group w-full">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <select 
                        className="w-full pl-12 pr-8 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 appearance-none cursor-pointer truncate"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      >
                        <option value="">Tất cả địa điểm</option>
                        {LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                   </div>

                   {/* Search Button */}
                   <div className="w-full md:w-auto p-1 md:p-0 md:pl-2 flex-shrink-0">
                      <Button size="lg" className="w-full md:w-auto px-6 rounded-lg shadow-sm text-base whitespace-nowrap">
                        Tìm kiếm
                      </Button>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-gray-500 text-sm">
                  Tìm thấy <span className="font-bold text-gray-900">{filteredJobs.length}</span> kết quả phù hợp
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Sắp xếp: 
                  <select className="border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer py-0 pl-2 pr-6">
                    <option>Mới nhất</option>
                    <option>Lương cao nhất</option>
                    <option>Cập nhật gần đây</option>
                  </select>
                </div>
             </div>

             <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Link to={`/job/${job.id}`} key={job.id} className="block group">
                      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                            <Building2 className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                <div>
                                   <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                                     {job.title}
                                   </h3>
                                   <p className="text-gray-500 text-sm font-medium">{job.company}</p>
                                </div>
                                <div className="flex-shrink-0">
                                   <Badge variant={job.type === JobType.FULL_TIME ? 'default' : 'outline'}>{job.type}</Badge>
                                </div>
                             </div>
                             
                             <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 mt-4">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  {job.postedAt}
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                     <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                        <Search className="h-12 w-12" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-900">Không tìm thấy kết quả</h3>
                     <p className="text-gray-500 mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm của bạn.</p>
                     <Button variant="outline" className="mt-4" onClick={clearFilters}>Xóa bộ lọc</Button>
                  </div>
                )}
             </div>

             {filteredJobs.length > 0 && (
               <div className="mt-8 flex justify-center">
                 <nav className="flex items-center gap-2">
                   <Button variant="outline" size="sm" disabled>Trước</Button>
                   <Button variant="primary" size="sm" className="bg-primary-600 text-white">1</Button>
                   <Button variant="ghost" size="sm">2</Button>
                   <Button variant="ghost" size="sm">3</Button>
                   <span className="text-gray-400">...</span>
                   <Button variant="ghost" size="sm">10</Button>
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