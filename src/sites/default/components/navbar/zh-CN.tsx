'use client';

import React, { useState, useEffect } from 'react';
import SiteLink from '@/components/SiteLink';

// ========================================
// 类型定义
// ========================================

interface MenuItem {
  title: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  title: string;
  href: string;
}

interface NavBarProps {
  logoSrc?: string;
  logoAlt?: string;
  mainMenuItems?: MenuItem[];
  bottomMenuItems?: MenuItem[];
  sticky?: boolean;
  className?: string;
}

// ========================================
// 下拉菜单组件
// ========================================

interface DropdownMenuProps {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-200 ease-out ${className}`}
      style={{
        animation: 'slideDown 200ms ease-out'
      }}
      onMouseLeave={(e) => {
        // 延迟关闭，防止鼠标快速移动时意外关闭
        const timeout = setTimeout(() => {
          onClose();
        }, 100);

        // 清理定时器（如果组件在延迟期间卸载）
        return () => clearTimeout(timeout);
      }}
    >
      <ul className="py-2" role="menu">
        {items.map((item, index) => (
          <li key={index}>
            <SiteLink
              href={item.href}
              className="block px-4 py-3 text-gray-dark hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150"
              role="menuitem"
              onClick={onClose}
            >
              {item.title}
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ========================================
// 主导航栏组件
// ========================================

export const NavBar: React.FC<NavBarProps> = ({
  logoSrc = '/images/meeyi.png',
  logoAlt = 'Meeyi Logo',
  mainMenuItems = [
    { title: '首页', href: '/' },
    { title: '新闻资讯', href: '/news' },
    {
      title: '产品',
      href: '/products',
      hasDropdown: true,
      dropdownItems: [
        { title: '产品类别 A', href: '/products/category-a' },
        { title: '产品类别 B', href: '/products/category-b' },
        { title: '产品类别 C', href: '/products/category-c' },
        { title: '查看全部产品', href: '/products' }
      ]
    },
    {
      title: '解决方案',
      href: '/solutions',
      hasDropdown: true,
      dropdownItems: [
        { title: '企业解决方案', href: '/solutions/enterprise' },
        { title: '中小企业方案', href: '/solutions/sme' },
        { title: '个人解决方案', href: '/solutions/personal' },
        { title: '查看全部方案', href: '/solutions' }
      ]
    },
    { title: '服务', href: '/services' },
    { title: '关于', href: '/about' }
  ],
  bottomMenuItems = [],
  sticky = true,
  className = ''
}) => {
  // 客户端挂载状态
  const [isClient, setIsClient] = useState(false);

  // 移动端菜单状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 下拉菜单状态（按索引）
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // 客户端挂载后设置状态
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 关闭所有下拉菜单
  const closeAllDropdowns = () => {
    setOpenDropdownIndex(null);
  };

  // 处理菜单项悬停
  const handleMenuItemMouseEnter = (index: number) => {
    if (isClient && window.innerWidth >= 1024) {
      // 仅在桌面端启用悬停触发下拉菜单
      setOpenDropdownIndex(index);
    }
  };

  // 处理菜单项离开
  const handleMenuItemMouseLeave = () => {
    // 延迟关闭，让用户有时间移动鼠标到下拉菜单
    setTimeout(() => {
      closeAllDropdowns();
    }, 150);
  };

  // 处理菜单项焦点
  const handleMenuItemFocus = (index: number) => {
    if (isClient && window.innerWidth >= 1024) {
      setOpenDropdownIndex(index);
    }
  };

  // 处理菜单项点击
  const handleMenuItemClick = (index: number, hasDropdown: boolean) => {
    if (hasDropdown) {
      // 在移动端，点击切换下拉菜单
      if (isClient && window.innerWidth < 1024) {
        if (openDropdownIndex === index) {
          setOpenDropdownIndex(null);
        } else {
          setOpenDropdownIndex(index);
        }
      }
    }
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdownIndex(null); // 关闭所有下拉菜单
  };

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdownIndex(null);
  };

  return (
    <nav
      className={`w-full bg-white shadow-sm transition-all duration-200 ${
        sticky ? 'sticky top-0 z-50' : ''
      } ${className}`}
      style={{ height: '72px' }}
    >
      {/* 内容区域 - 居中并限制最大宽度 */}
      <div className="max-w-screen-xl xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 h-full">
        <div className="flex items-center justify-center h-full gap-8">
          {/* Logo 区域 */}
          <SiteLink href="/" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-10 w-auto"
            />
          </SiteLink>

          {/* 桌面端导航菜单 - 居中 */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {mainMenuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMenuItemMouseEnter(index)}
                onMouseLeave={handleMenuItemMouseLeave}
              >
                <SiteLink
                  href={item.href}
                  className="nav-link px-4 py-2 text-base font-medium text-gray-dark hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 relative group"
                  onClick={() => item.hasDropdown && handleMenuItemClick(index, true)}
                  onFocus={() => item.hasDropdown && handleMenuItemFocus(index)}
                >
                  <span className="relative">
                    {item.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                  </span>
                </SiteLink>

                {/* 下拉菜单 */}
                {item.hasDropdown && item.dropdownItems && (
                  <DropdownMenu
                    items={item.dropdownItems}
                    isOpen={openDropdownIndex === index}
                    onClose={closeAllDropdowns}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 底部菜单项（桌面端） - 右侧 */}
          {bottomMenuItems && bottomMenuItems.length > 0 && (
            <div className="hidden lg:flex items-center space-x-6">
              {bottomMenuItems.map((item, index) => (
                <SiteLink
                  key={index}
                  href={item.href}
                  className="nav-link px-3 py-2 text-sm font-medium text-gray-dark hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 relative group"
                >
                  <span className="relative">
                    {item.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                  </span>
                </SiteLink>
              ))}
            </div>
          )}

          {/* 移动端汉堡菜单按钮 */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-dark hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150"
              aria-expanded={isMobileMenuOpen}
              aria-label="打开菜单"
              onClick={toggleMobileMenu}
            >
              {/* 汉堡图标 */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  // 关闭图标
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // 汉堡图标
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单（全屏展开） */}
      {isMobileMenuOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* 移动端菜单内容 */}
          <div
            className="fixed top-[72px] left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto"
            style={{
              animation: 'slideDown 250ms ease-out'
            }}
          >
            <div className="max-w-screen-xl xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 py-6">
              {/* 主导航菜单 */}
              <ul className="space-y-2 mb-6" role="menu">
                {mainMenuItems.map((item, index) => (
                  <li key={index} role="none">
                    <div>
                      {/* 菜单项标题 */}
                      <SiteLink
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-lg font-medium text-gray-dark hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-150"
                        role="menuitem"
                        onClick={() => handleMenuItemClick(index, !!item.hasDropdown)}
                      >
                        <span>{item.title}</span>
                        {item.hasDropdown && (
                          <svg
                            className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                              openDropdownIndex === index ? 'rotate-180' : ''
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </SiteLink>

                      {/* 移动端下拉菜单 */}
                      {item.hasDropdown && item.dropdownItems && (
                        <ul
                          className={`mt-2 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
                            openDropdownIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                          role="menu"
                        >
                          {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                            <li key={dropdownIndex} role="none">
                              <SiteLink
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-base text-gray-dark hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-150"
                                role="menuitem"
                                onClick={closeMobileMenu}
                              >
                                {dropdownItem.title}
                              </SiteLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* 底部菜单项 */}
              {bottomMenuItems && bottomMenuItems.length > 0 && (
                <div className="border-t border-primary-200 pt-6">
                  <ul className="space-y-2" role="menu">
                    {bottomMenuItems.map((item, index) => (
                      <li key={index} role="none">
                        <SiteLink
                          href={item.href}
                          className="block px-4 py-3 text-base font-medium text-gray-dark hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-150"
                          role="menuitem"
                          onClick={closeMobileMenu}
                        >
                          {item.title}
                        </SiteLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 自定义滚动条样式（移动端菜单） */
        .lg\\:hidden::-webkit-scrollbar {
          width: 6px;
        }

        .lg\\:hidden::-webkit-scrollbar-track {
          background: #F3F4F6;
        }

        .lg\\:hidden::-webkit-scrollbar-thumb {
          background: #BBF7D0;
          border-radius: 3px;
        }

        .lg\\:hidden::-webkit-scrollbar-thumb:hover {
          background: #86EFAC;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
