import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2, Briefcase, CheckCircle, X, FileText, Upload, Check, User, Mail, Phone, Monitor, Layers, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

// Mock Data for User CVs
const MOCK_USER_CVS = [
  { id: 1, name: 'CV_NguyenVanA_SeniorReact.pdf', size: '2.5 MB', date: '10/10/2023' },
  { id: 2, name: 'CV_NguyenVanA_FullStack.pdf', size: '1.8 MB', date: '05/09/2023' },
];

export const JobDetail: React.FC = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  
  // State for Application Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState<number | null>(MOCK_USER_CVS[0].id);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
  };

  const handleSubmitApplication = () => {
    if (!selectedCv) {
      addToast('Vui lòng chọn CV để ứng tuyển', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      addToast('Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ bạn sớm.', 'success');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
             <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                   <div className="h-20 w-20 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                     <Building2 className="h-10 w-10" />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900 mb-2">Senior React Engineer</h1>
                     <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Building2 className="h-4 w-4"/> TechCorp Vietnam</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> Hồ Chí Minh</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> 2 giờ trước</span>
                     </div>
                   </div>
                </div>
             </div>

             <div className="border-t border-gray-100 pt-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Mô tả công việc</h3>
               <p className="text-gray-600 leading-relaxed mb-6">
                 Chúng tôi đang tìm kiếm một Senior React Engineer tài năng để tham gia vào đội ngũ phát triển sản phẩm. Bạn sẽ chịu trách nhiệm xây dựng các tính năng mới, tối ưu hóa hiệu suất và đảm bảo trải nghiệm người dùng tốt nhất.
               </p>
               
               <h3 className="text-lg font-bold text-gray-900 mb-4">Trách nhiệm chính</h3>
               <ul className="space-y-3 mb-6">
                 {[
                   'Phát triển các tính năng mới sử dụng React, TypeScript và Tailwind CSS',
                   'Tối ưu hóa hiệu suất ứng dụng để đảm bảo tốc độ tải trang nhanh nhất',
                   'Phối hợp với đội ngũ thiết kế và backend để triển khai sản phẩm',
                   'Review code và hướng dẫn các thành viên junior trong team'
                 ].map((item, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-gray-600">
                     <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                     {item}
                   </li>
                 ))}
               </ul>

               <h3 className="text-lg font-bold text-gray-900 mb-4">Yêu cầu</h3>
               <ul className="space-y-3 mb-8">
                  {[
                   'Ít nhất 4 năm kinh nghiệm làm việc với ReactJS',
                   'Thành thạo TypeScript và các modern frontend tools',
                   'Có kinh nghiệm về tối ưu hóa hiệu suất và SEO',
                   'Khả năng đọc hiểu tài liệu tiếng Anh tốt'
                 ].map((item, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-gray-600">
                     <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                     {item}
                   </li>
                 ))}
               </ul>

               <div className="flex gap-4">
                 <Button size="lg" onClick={handleOpenModal}>Ứng tuyển ngay</Button>
                 <Button variant="outline" size="lg">Lưu tin</Button>
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Thông tin chung</h3>
              <div className="space-y-4">
                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Mức lương</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <DollarSign className="h-5 w-5 text-primary-600" />
                      2500$ - 3500$
                   </div>
                 </div>
                 
                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Hình thức làm việc</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                      Toàn thời gian
                   </div>
                 </div>

                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Loại công việc</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <Monitor className="h-5 w-5 text-primary-600" />
                      Tại văn phòng
                   </div>
                 </div>

                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Địa điểm</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <MapPin className="h-5 w-5 text-primary-600" />
                      Hồ Chí Minh
                   </div>
                 </div>

                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Lĩnh vực</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <Layers className="h-5 w-5 text-primary-600" />
                      Công nghệ thông tin
                   </div>
                 </div>

                 <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Cần tuyển</label>
                   <div className="flex items-center gap-2 text-gray-900 font-medium mt-1">
                      <Users className="h-5 w-5 text-primary-600" />
                      2 người
                   </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Về công ty</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-500"/>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">TechCorp Vietnam</div>
                    <div className="text-xs text-gray-500">Công nghệ thông tin</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  TechCorp là công ty công nghệ hàng đầu chuyên cung cấp các giải pháp phần mềm cho doanh nghiệp.
                </p>
                <Link to="#" className="text-sm text-primary-600 hover:underline">Xem thêm việc làm khác</Link>
              </div>
           </div>
        </div>
      </div>

      {/* --- APPLICATION MODAL --- */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900">Ứng tuyển công việc</h3>
                    <p className="text-sm text-gray-500">Senior React Engineer - TechCorp Vietnam</p>
                 </div>
                 <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                   <X className="h-5 w-5" />
                 </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                 {/* 1. Contact Info (Read-only for speed) */}
                 <div className="mb-6">
                    <h4 className="font-bold text-sm text-gray-900 uppercase mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-600" /> Thông tin liên hệ
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                       <div className="flex items-center gap-3 text-sm text-gray-700">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Nguyễn Văn A</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>nguyenvana@example.com</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>0901234567</span>
                       </div>
                    </div>
                 </div>

                 {/* 2. Select CV */}
                 <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="font-bold text-sm text-gray-900 uppercase flex items-center gap-2">
                         <FileText className="h-4 w-4 text-primary-600" /> Chọn CV ứng tuyển
                       </h4>
                       <span className="text-xs text-red-500 font-medium">* Bắt buộc</span>
                    </div>
                    
                    <div className="space-y-3">
                       {MOCK_USER_CVS.map((cv) => (
                          <div 
                            key={cv.id}
                            onClick={() => setSelectedCv(cv.id)}
                            className={`
                              relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                              ${selectedCv === cv.id 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                              }
                            `}
                          >
                             <div className={`
                               h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0
                               ${selectedCv === cv.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}
                             `}>
                                <FileText className="h-6 w-6" />
                             </div>
                             <div className="flex-1">
                                <div className={`font-medium text-sm ${selectedCv === cv.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                  {cv.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Cập nhật: {cv.date} • {cv.size}
                                </div>
                             </div>
                             {selectedCv === cv.id && (
                                <div className="h-5 w-5 bg-primary-600 rounded-full flex items-center justify-center">
                                   <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                </div>
                             )}
                          </div>
                       ))}

                       {/* Upload New Option */}
                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/10 transition-colors group">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mb-2" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-primary-700">Tải lên CV mới</span>
                          <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</span>
                       </div>
                    </div>
                 </div>

                 {/* 3. Cover Letter */}
                 <div>
                    <h4 className="font-bold text-sm text-gray-900 uppercase mb-3 flex items-center gap-2">
                       <FileText className="h-4 w-4 text-primary-600" /> Thư giới thiệu (Không bắt buộc)
                    </h4>
                    <textarea 
                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 min-h-[120px] text-sm"
                       placeholder="Viết đôi lời giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
                       value={coverLetter}
                       onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                    <div className="text-right mt-1">
                       <button className="text-xs text-primary-600 font-medium hover:underline">
                         Sử dụng AI gợi ý thư giới thiệu
                       </button>
                    </div>
                 </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                 <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>
                   Hủy bỏ
                 </Button>
                 <Button 
                   onClick={handleSubmitApplication} 
                   isLoading={isSubmitting}
                   className="shadow-lg shadow-primary-200"
                 >
                   Nộp hồ sơ ứng tuyển
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};