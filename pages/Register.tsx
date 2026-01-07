import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Role } from '../types';
import { useToast } from '../components/ui/Toast';

interface RegisterProps {
  onLogin: (role: Role) => void;
}

export const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [role, setRole] = useState<Role>(Role.CANDIDATE);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        addToast('Mật khẩu nhập lại không khớp!', 'error');
        return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
      addToast(`Đăng ký tài khoản ${role === Role.EMPLOYER ? 'Nhà tuyển dụng' : 'Ứng viên'} thành công!`, 'success');
      
      if (role === Role.EMPLOYER) navigate('/employer');
      else navigate('/candidate');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-sm text-gray-600">
            Gia nhập cộng đồng tuyển dụng hàng đầu Việt Nam
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl">
            <button
              className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 focus:outline-none ${
                role === Role.CANDIDATE
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole(Role.CANDIDATE)}
            >
              <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4"/>
                  Ứng viên
              </div>
            </button>
            <button
              className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 focus:outline-none ${
                role === Role.EMPLOYER
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole(Role.EMPLOYER)}
            >
              <div className="flex items-center justify-center gap-2">
                  <Building2 className="h-4 w-4"/>
                  Nhà tuyển dụng
              </div>
            </button>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với <a href="#" className="text-primary-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary-600 hover:underline">Chính sách bảo mật</a>
              </label>
            </div>

          <Button
            type="submit"
            className="w-full justify-center py-3 mt-6"
            isLoading={isLoading}
          >
            Đăng ký tài khoản <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Đăng nhập ngay
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};