import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, User, Bell, LogOut, ChevronDown, Heart, LayoutDashboard, Search, Building2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentRole, onSwitchRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onSwitchRole(Role.GUEST);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Simple helper for displaying role name
  const getRoleName = (role: Role) => {
    switch(role) {
      case Role.ADMIN: return "Admin";
      case Role.EMPLOYER: return "Nhà tuyển dụng";
      case Role.CANDIDATE: return "Ứng viên";
      default: return "";
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Red<span className="text-primary-600">Recruit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/') ? 'text-primary-600' : 'text-gray-600'}`}
            >
              Trang chủ
            </Link>
            
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/jobs') ? 'text-primary-600' : 'text-gray-600'}`}
            >
              Việc làm
            </Link>
            
            <Link 
              to="/candidates" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/candidates') ? 'text-primary-600' : 'text-gray-600'}`}
            >
              Hồ sơ ứng viên
            </Link>

             {currentRole === Role.ADMIN && (
               <Link 
               to="/admin" 
               className={`text-sm font-medium transition-colors hover:text-primary-600 ${isActive('/admin') ? 'text-primary-600' : 'text-gray-600'}`}
             >
               Quản trị
             </Link>
            )}

          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {currentRole !== Role.GUEST ? (
              <div className="flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div className="relative group h-full flex items-center">
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer py-1">
                    <div className="text-right hidden lg:block">
                       <div className="text-sm font-bold text-gray-900">Người dùng Demo</div>
                       <div className="text-xs text-primary-600 font-medium">{getRoleName(currentRole)}</div>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-200 flex items-center justify-center text-primary-700 font-bold shadow-sm transition-transform group-hover:scale-105">
                      {currentRole === Role.ADMIN ? 'A' : currentRole === Role.EMPLOYER ? 'E' : 'C'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-200 group-hover:rotate-180" />
                  </div>

                  {/* Dropdown Content Wrapper */}
                  <div className="absolute top-full right-0 pt-2 w-60 hidden group-hover:block z-50">
                      {/* Actual Menu Box */}
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 relative">
                        
                        {/* Decorative Arrow */}
                        <div className="absolute -top-1.5 right-8 h-3 w-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                        
                        {currentRole === Role.CANDIDATE && (
                          <div className="space-y-1 relative z-10">
                            <Link to="/candidate" state={{ tab: 'profile' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <User className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Hồ sơ cá nhân
                            </Link>
                            <Link to="/candidate" state={{ tab: 'applications' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <Briefcase className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Việc đã ứng tuyển
                            </Link>
                            <Link to="/candidate" state={{ tab: 'saved' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <Heart className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Việc đã lưu
                            </Link>
                          </div>
                        )}

                        {currentRole === Role.EMPLOYER && (
                          <div className="space-y-1 relative z-10">
                             <Link to="/employer" state={{ tab: 'overview' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <LayoutDashboard className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Bảng điều khiển
                            </Link>
                             <Link to="/employer" state={{ tab: 'profile' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <Building2 className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Hồ sơ công ty
                            </Link>
                             <Link to="/employer" state={{ tab: 'jobs' }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <Briefcase className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Quản lý tin đăng
                            </Link>
                             <Link to="/candidates" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors group/item">
                              <Search className="h-4 w-4 text-gray-400 group-hover/item:text-primary-600" /> Tìm ứng viên
                            </Link>
                          </div>
                        )}

                        {currentRole === Role.ADMIN && (
                          <div className="space-y-1 relative z-10">
                             <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors">
                              <LayoutDashboard className="h-4 w-4 text-gray-400" /> Quản trị hệ thống
                            </Link>
                          </div>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left relative z-10">
                          <LogOut className="h-4 w-4" /> Đăng xuất
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Đăng ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4 shadow-lg">
             <Link to="/" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
             <Link to="/jobs" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Việc làm</Link>
             <Link to="/candidates" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Hồ sơ ứng viên</Link>
             
             {currentRole !== Role.GUEST ? (
               <>
                 {currentRole === Role.CANDIDATE && <Link to="/candidate" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Hồ sơ cá nhân</Link>}
                 {currentRole === Role.EMPLOYER && (
                    <>
                      <Link to="/employer" state={{ tab: 'overview' }} className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Bảng điều khiển</Link>
                      <Link to="/employer" state={{ tab: 'profile' }} className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Hồ sơ công ty</Link>
                      <Link to="/employer" state={{ tab: 'jobs' }} className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Quản lý tin đăng</Link>
                    </>
                 )}
                 {currentRole === Role.ADMIN && <Link to="/admin" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Quản trị hệ thống</Link>}
                 <div className="pt-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full py-2 text-sm font-medium text-red-600">
                      <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                    </button>
                 </div>
               </>
             ) : (
               <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Đăng nhập</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Đăng ký</Button>
                  </Link>
               </div>
             )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <div className="bg-primary-600 p-1 rounded-md">
                 <Briefcase className="h-5 w-5 text-white" />
               </div>
               <span className="text-lg font-bold text-gray-900">RedRecruit</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nền tảng tuyển dụng hàng đầu kết nối ứng viên tài năng với các doanh nghiệp uy tín.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Giới thiệu</li>
              <li>Tuyển dụng</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold text-gray-900 mb-4">Dành cho ứng viên</h4>
             <ul className="space-y-2 text-sm text-gray-500">
               <li>Việc làm mới nhất</li>
               <li>Tạo CV online</li>
               <li>Cẩm nang nghề nghiệp</li>
             </ul>
          </div>
          <div>
             <h4 className="font-semibold text-gray-900 mb-4">Dành cho nhà tuyển dụng</h4>
             <ul className="space-y-2 text-sm text-gray-500">
               <li>Đăng tin tuyển dụng</li>
               <li>Tìm kiếm hồ sơ</li>
               <li>Báo giá dịch vụ</li>
             </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          © 2024 RedRecruit. All rights reserved.
        </div>
      </footer>
    </div>
  );
};