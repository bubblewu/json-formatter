'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-6">
      <div className="max-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">JSON工具</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">JSON格式化</Link></li>
              <li><Link href="/validator" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">JSON验证</Link></li>
              <li><Link href="/compare" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">JSON比较</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">资源</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">API文档</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">博客</Link></li>
              <li><Link href="/guides" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">使用指南</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">关于我们</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">关于我们</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">联系我们</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">隐私政策</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} JSON Formatter. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 