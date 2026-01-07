import React from 'react';
import { Users, Briefcase, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản trị hệ thống</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Tổng người dùng', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Tin tuyển dụng', value: '456', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-100' },
          { label: 'Doanh thu tháng', value: '50M VNĐ', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Tin cần duyệt', value: '12', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <h3 className="font-bold text-gray-900">Tin tuyển dụng mới chờ duyệt</h3>
             <Button variant="ghost" size="sm" className="text-primary-600">Xem tất cả</Button>
          </div>
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">Marketing Executive</div>
                    <div className="text-xs text-gray-500">Công ty ABC</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Vừa xong</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-green-600 hover:text-green-800 font-medium">Duyệt</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <h3 className="font-bold text-gray-900">Người dùng mới đăng ký</h3>
             <Button variant="ghost" size="sm" className="text-primary-600">Xem tất cả</Button>
          </div>
           <div className="p-6 space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">U</div>
                   <div>
                     <div className="font-medium text-gray-900">Nguyễn Văn {i}</div>
                     <div className="text-xs text-gray-500">nguyen{i}@gmail.com</div>
                   </div>
                 </div>
                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Ứng viên</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};