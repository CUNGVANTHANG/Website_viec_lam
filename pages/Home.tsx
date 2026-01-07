import React, { useState } from 'react';
import { 
  Search, MapPin, DollarSign, Clock, Building2, 
  Code, Megaphone, BarChart3, PenTool, 
  Monitor, Stethoscope, GraduationCap, ShoppingBag,
  ArrowRight, CheckCircle2, Star, Briefcase, Layers, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Job, JobType } from '../types';
import { Link } from 'react-router-dom';

// Mock Data Jobs
const MOCK_JOBS: Job[] = [
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
  }
];

// Mock Categories
const CATEGORIES = [
  { name: 'IT / Phần mềm', count: '1,203', icon: Code },
  { name: 'Marketing', count: '842', icon: Megaphone },
  { name: 'Kinh doanh / Bán hàng', count: '2,105', icon: BarChart3 },
  { name: 'Thiết kế', count: '540', icon: PenTool },
  { name: 'Hành chính / Nhân sự', count: '430', icon: Briefcase },
  { name: 'Giáo dục / Đào tạo', count: '320', icon: GraduationCap },
  { name: 'Y tế / Chăm sóc sức khỏe', count: '210', icon: Stethoscope },
  { name: 'Bán lẻ / Tiêu dùng', count: '650', icon: ShoppingBag },
];

const INDUSTRIES = ['IT / Phần mềm', 'Marketing / Truyền thông', 'Kinh doanh / Bán hàng', 'Hành chính / Nhân sự', 'Tài chính / Kế toán', 'Sản xuất / Vận hành'];

// Mock Top Companies
const TOP_COMPANIES = [
  { name: 'TechCorp', location: 'Hồ Chí Minh', jobs: 12 },
  { name: 'Vingroup', location: 'Hà Nội', jobs: 45 },
  { name: 'FPT Software', location: 'Toàn quốc', jobs: 89 },
  { name: 'Viettel', location: 'Hà Nội', jobs: 34 },
  { name: 'Shopee', location: 'Hồ Chí Minh', jobs: 28 },
  { name: 'Momo', location: 'Hồ Chí Minh', jobs: 15 },
  // Adding more mock companies for a better marquee effect
  { name: 'Tiki', location: 'Hồ Chí Minh', jobs: 22 },
  { name: 'Zalo', location: 'Hồ Chí Minh', jobs: 18 },
];

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Duplicate the companies list to create a seamless loop
  const marqueeCompanies = [...TOP_COMPANIES, ...TOP_COMPANIES];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 pt-24 pb-32 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay blur-3xl transform translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5 text-sm uppercase tracking-wider">
            Nền tảng tuyển dụng #1 Việt Nam
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Kết nối sự nghiệp <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Nâng tầm tương lai</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Tiếp cận hơn 5,000+ cơ hội việc làm hấp dẫn từ các doanh nghiệp hàng đầu. Đơn giản, nhanh chóng và hiệu quả.
          </p>
          
          {/* Main Search Bar */}
          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow-[2] relative group">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm vị trí, kỹ năng, công ty..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all outline-none font-medium text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

               {/* Industry Select */}
               <div className="flex-1 md:min-w-[200px] relative group md:border-l md:border-gray-200 md:pl-3">
                <Layers className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <select className="w-full pl-12 pr-8 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all outline-none appearance-none font-medium text-gray-700 cursor-pointer truncate">
                  <option value="">Tất cả lĩnh vực</option>
                  {INDUSTRIES.map(ind => (
                     <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Location Select */}
              <div className="flex-1 md:min-w-[200px] relative group md:border-l md:border-gray-200 md:pl-3">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <select className="w-full pl-12 pr-8 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all outline-none appearance-none font-medium text-gray-700 cursor-pointer truncate">
                  <option value="">Tất cả địa điểm</option>
                  <option value="ToanQuoc">Toàn quốc</option>
                  <option value="HCM">Hồ Chí Minh</option>
                  <option value="HN">Hà Nội</option>
                  <option value="DN">Đà Nẵng</option>
                  <option value="CT">Cần Thơ</option>
                  <option value="BD">Bình Dương</option>
                  <option value="HP">Hải Phòng</option>
                  <option value="Remote">Remote (Từ xa)</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <Button size="lg" className="w-full md:w-auto px-8 py-3 rounded-xl shadow-lg shadow-primary-500/30 text-base whitespace-nowrap">
                Tìm việc ngay
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-primary-100">
            <span className="opacity-75">Từ khóa phổ biến:</span>
            {['ReactJS', 'Marketing', 'Sale Admin', 'Kế toán', 'Tester'].map((tag) => (
              <span key={tag} className="cursor-pointer hover:text-white underline decoration-dotted underline-offset-4 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Top Categories Section */}
      <section className="py-20 bg-gray-50 -mt-16 relative z-20 rounded-t-[3rem]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Khám phá theo ngành nghề</h2>
            <p className="text-gray-500">Các lĩnh vực đang có nhu cầu tuyển dụng cao nhất</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="h-14 w-14 rounded-xl bg-primary-50 text-primary-600 mb-4 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count} việc làm</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Jobs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Việc làm mới nhất</h2>
              <p className="text-gray-500">Đừng bỏ lỡ những cơ hội hấp dẫn vừa được cập nhật</p>
            </div>
            <Link to="/jobs">
               <Button variant="outline" className="group">
                 Xem tất cả việc làm 
                 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"/>
               </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_JOBS.map((job) => (
              <Link to={`/job/${job.id}`} key={job.id} className="group block">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-100 transition-all duration-300 h-full relative overflow-hidden">
                   {/* Decorative hover effect */}
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                   
                  <div className="flex items-start gap-5">
                    <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-gray-500 font-medium mb-3">{job.company}</p>
                        </div>
                         {job.type === JobType.FULL_TIME && <Badge className="bg-blue-50 text-blue-700 border-blue-100">Full-time</Badge>}
                         {job.type === JobType.PART_TIME && <Badge className="bg-orange-50 text-orange-700 border-orange-100">Part-time</Badge>}
                         {job.type === JobType.FREELANCE && <Badge className="bg-purple-50 text-purple-700 border-purple-100">Freelance</Badge>}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md font-semibold text-primary-700">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                         <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          {job.postedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Employers Section (Marquee) */}
      <section className="py-20 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Nhà tuyển dụng hàng đầu</h2>
            <p className="text-gray-500">Hợp tác với các doanh nghiệp uy tín nhất</p>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
           {/* Fade overlay left */}
           <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
           {/* Fade overlay right */}
           <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>

           <div className="flex animate-marquee w-max">
            {marqueeCompanies.map((company, idx) => (
              <div key={idx} className="mx-4 w-60 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group">
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400 group-hover:scale-110 transition-transform">
                   <Building2 className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{company.name}</h4>
                <div className="text-xs text-gray-400 mb-2">{company.location}</div>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{company.jobs} việc làm</span>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* 5. How It Works Section */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Quy trình tuyển dụng</h2>
            <p className="text-gray-500">3 bước đơn giản để có công việc mơ ước</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             {/* Connector Line for Desktop */}
             <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 z-0 w-2/3 mx-auto"></div>

             {[
               { title: 'Tạo hồ sơ', desc: 'Đăng ký tài khoản và hoàn thiện hồ sơ năng lực của bạn.', icon: PenTool },
               { title: 'Tìm kiếm việc làm', desc: 'Lựa chọn công việc phù hợp với kỹ năng và mong muốn.', icon: Search },
               { title: 'Ứng tuyển & Phỏng vấn', desc: 'Gửi hồ sơ và tham gia phỏng vấn trực tiếp với doanh nghiệp.', icon: CheckCircle2 }
             ].map((step, idx) => (
               <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-24 w-24 bg-white border-4 border-primary-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white">
                       <step.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 max-w-xs leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
       </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

         <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12">Mọi người nói gì về RedRecruit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Nguyễn Văn A', role: 'Frontend Developer', content: 'Tôi đã tìm được công việc ưng ý tại một công ty công nghệ lớn chỉ sau 3 ngày đăng hồ sơ. Quy trình rất nhanh chóng và chuyên nghiệp.' },
                { name: 'Trần Thị B', role: 'HR Manager', content: 'RedRecruit giúp chúng tôi tiết kiệm 50% thời gian tuyển dụng nhờ hệ thống lọc hồ sơ thông minh và chính xác.' },
                { name: 'Lê Văn C', role: 'Marketing Executive', content: 'Giao diện thân thiện, dễ sử dụng. Tôi đặc biệt thích tính năng gợi ý việc làm phù hợp qua email hàng ngày.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{item.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-white">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-12 bg-gray-50 flex flex-col justify-center items-start text-left">
                   <Badge variant="outline" className="mb-4 bg-white">Dành cho Ứng viên</Badge>
                   <h3 className="text-3xl font-bold text-gray-900 mb-4">Bạn đang tìm kiếm cơ hội mới?</h3>
                   <p className="text-gray-600 mb-8 text-lg">Hàng ngàn việc làm chất lượng cao đang chờ đón. Hãy tạo hồ sơ ngay để nhà tuyển dụng tìm thấy bạn.</p>
                   <Button size="lg" className="shadow-lg shadow-gray-200">
                     Tạo CV ngay <ArrowRight className="ml-2 h-5 w-5"/>
                   </Button>
                </div>
                <div className="p-12 bg-primary-600 flex flex-col justify-center items-start text-left text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                   <Badge className="mb-4 bg-primary-500 text-white border-primary-400">Dành cho Nhà tuyển dụng</Badge>
                   <h3 className="text-3xl font-bold mb-4">Bạn muốn tìm nhân tài?</h3>
                   <p className="text-primary-100 mb-8 text-lg">Đăng tin tuyển dụng và tiếp cận hàng triệu ứng viên tiềm năng. Giải pháp tuyển dụng hiệu quả cho doanh nghiệp.</p>
                   <Button variant="white" size="lg" className="shadow-lg shadow-primary-700/50 border-none">
                     Đăng tin ngay <ArrowRight className="ml-2 h-5 w-5"/>
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};