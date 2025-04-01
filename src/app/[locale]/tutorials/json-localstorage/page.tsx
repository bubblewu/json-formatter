"use client";

import { useTranslations } from 'next-intl';
import BreadcrumbNav from '@/components/Breadcrumb';
import MetadataClient from './metadata.client';

export default function JsonLocalStorageTutorial() {
  const t = useTranslations('localstorage');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MetadataClient />
      <BreadcrumbNav />
      
      <h1 className="text-3xl font-bold mb-6">{t('pageTitle')}</h1>
      
      <div className="space-y-12">
        <section id="introduction">
          <h2 className="text-2xl font-semibold mb-4">{t('introduction.title')}</h2>
          <p className="mb-4">
            {t('introduction.description')}
          </p>
          <p className="mb-4">
            {t('introduction.detailedDescription')}
          </p>
        </section>

        <section id="localstorage-basics">
          <h2 className="text-2xl font-semibold mb-4">{t('basics.title')}</h2>
          <p className="mb-4">
            {t('basics.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('basics.feature1')}</li>
            <li>{t('basics.feature2')}</li>
            <li>{t('basics.feature3')}</li>
            <li>{t('basics.feature4')}</li>
          </ul>
          
          <h3 className="font-medium mb-2">{t('basics.basicAPI')}</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 存储数据
localStorage.setItem('key', 'value');

// 获取数据
const value = localStorage.getItem('key');

// 删除特定数据
localStorage.removeItem('key');

// 清除所有数据
localStorage.clear();

// 获取存储项数量
const count = localStorage.length;

// 获取指定索引的键名
const keyName = localStorage.key(index);`}
              </code>
            </pre>
          </div>
        </section>

        <section id="json-localstorage">
          <h2 className="text-2xl font-semibold mb-4">{t('jsonWithLocalstorage.title')}</h2>
          <p className="mb-4">
            {t('jsonWithLocalstorage.description')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 存储对象到LocalStorage
const user = {
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

// 将对象转换为JSON字符串并存储
localStorage.setItem('user', JSON.stringify(user));

// 从LocalStorage获取数据并解析回对象
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // 输出: 张三
console.log(storedUser.preferences.theme); // 输出: dark`}
              </code>
            </pre>
          </div>
          
          <p className="mb-4">
            {t('jsonWithLocalstorage.arrayStorage')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 存储数组到LocalStorage
const tasks = [
  { id: 1, text: '完成报告', completed: false },
  { id: 2, text: '购物', completed: true },
  { id: 3, text: '回复邮件', completed: false }
];

// 将数组转换为JSON字符串并存储
localStorage.setItem('tasks', JSON.stringify(tasks));

// 从LocalStorage获取数据并解析回数组
const storedTasks = JSON.parse(localStorage.getItem('tasks'));
console.log(storedTasks.length); // 输出: 3
console.log(storedTasks[1].text); // 输出: 购物`}
              </code>
            </pre>
          </div>
        </section>

        <section id="common-patterns">
          <h2 className="text-2xl font-semibold mb-4">{t('commonPatterns.title')}</h2>
          
          <h3 className="font-medium mb-2">{t('commonPatterns.wrapper')}</h3>
          <p className="mb-4">
            {t('commonPatterns.wrapperDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 创建LocalStorage工具类
const storageUtil = {
  // 存储数据
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  // 获取数据
  get: function(key) {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  
  // 删除数据
  remove: function(key) {
    localStorage.removeItem(key);
  },
  
  // 清除所有数据
  clear: function() {
    localStorage.clear();
  }
};

// 使用示例
storageUtil.set('user', { name: '李四', age: 30 });
const user = storageUtil.get('user');
console.log(user.name); // 输出: 李四`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('commonPatterns.updatingObjects')}</h3>
          <p className="mb-4">
            {t('commonPatterns.updatingDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 获取当前存储的用户
let user = JSON.parse(localStorage.getItem('user')) || {};

// 更新特定属性
user.lastLogin = new Date().toISOString();
user.loginCount = (user.loginCount || 0) + 1;

// 保存回LocalStorage
localStorage.setItem('user', JSON.stringify(user));`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('commonPatterns.arrayManagement')}</h3>
          <p className="mb-4">
            {t('commonPatterns.arrayDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 添加新项到数组
function addTask(task) {
  // 获取当前任务列表
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // 添加新任务
  tasks.push({
    id: Date.now(), // 使用时间戳作为简单的ID
    text: task,
    completed: false,
    createdAt: new Date().toISOString()
  });
  
  // 保存回LocalStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  return tasks;
}

// 删除数组中的项
function removeTask(taskId) {
  // 获取当前任务列表
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // 过滤掉要删除的任务
  tasks = tasks.filter(task => task.id !== taskId);
  
  // 保存回LocalStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  return tasks;
}

// 切换任务完成状态
function toggleTaskCompletion(taskId) {
  // 获取当前任务列表
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // 找到并更新任务
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  
  // 保存回LocalStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  return updatedTasks;
}`}
              </code>
            </pre>
          </div>
        </section>

        <section id="practical-examples">
          <h2 className="text-2xl font-semibold mb-4">{t('practicalExamples.title')}</h2>
          
          <h3 className="font-medium mb-2">{t('practicalExamples.userPrefs')}</h3>
          <p className="mb-4">
            {t('practicalExamples.userPrefsDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 保存用户界面偏好
function saveUserPreferences(preferences) {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// 获取用户界面偏好
function getUserPreferences() {
  const defaultPreferences = {
    theme: 'light',
    fontSize: 'medium',
    notifications: true,
    language: 'zh-CN'
  };
  
  try {
    const storedPrefs = localStorage.getItem('userPreferences');
    return storedPrefs ? JSON.parse(storedPrefs) : defaultPreferences;
  } catch (e) {
    console.error('Error getting preferences', e);
    return defaultPreferences;
  }
}

// 更新单个偏好设置
function updatePreference(key, value) {
  const preferences = getUserPreferences();
  preferences[key] = value;
  saveUserPreferences(preferences);
  return preferences;
}

// 应用用户界面偏好
function applyUserPreferences() {
  const prefs = getUserPreferences();
  
  // 应用主题
  document.body.className = prefs.theme;
  
  // 应用字体大小
  document.body.style.fontSize = {
    'small': '14px',
    'medium': '16px',
    'large': '18px'
  }[prefs.fontSize] || '16px';
  
  // 其他UI设置...
}`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('practicalExamples.shoppingCart')}</h3>
          <p className="mb-4">
            {t('practicalExamples.cartDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 购物车管理
const cart = {
  // 获取购物车
  getCart: function() {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      console.error('Error parsing cart', e);
      return [];
    }
  },
  
  // 保存购物车
  saveCart: function(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  },
  
  // 添加商品到购物车
  addItem: function(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // 更新现有商品数量
      existingItem.quantity += quantity;
    } else {
      // 添加新商品
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart(cart);
    return cart;
  },
  
  // 从购物车移除商品
  removeItem: function(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },
  
  // 更新商品数量
  updateQuantity: function(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
    }
    
    this.saveCart(cart);
    return cart;
  },
  
  // 计算购物车总价
  getTotalPrice: function() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // 清空购物车
  clearCart: function() {
    localStorage.removeItem('cart');
    return [];
  }
};`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('practicalExamples.formData')}</h3>
          <p className="mb-4">
            {t('practicalExamples.formDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 表单数据持久化
function setupFormPersistence(formId, storageKey) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // 从LocalStorage加载表单数据
  function loadFormData() {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // 填充表单字段
        for (const field in data) {
          const input = form.elements[field];
          if (input) {
            // 根据输入类型处理
            if (input.type === 'checkbox') {
              input.checked = data[field];
            } else if (input.type === 'radio') {
              const radio = form.querySelector(\`input[name="\${field}"][value="\${data[field]}"]\`);
              if (radio) radio.checked = true;
            } else {
              input.value = data[field];
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading form data', e);
    }
  }
  
  // 保存表单数据到LocalStorage
  function saveFormData() {
    const data = {};
    const formData = new FormData(form);
    
    for (const [key, value] of formData.entries()) {
      const input = form.elements[key];
      if (input.type === 'checkbox') {
        data[key] = input.checked;
      } else {
        data[key] = value;
      }
    }
    
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  
  // 清除保存的表单数据
  function clearFormData() {
    localStorage.removeItem(storageKey);
    form.reset();
  }
  
  // 为所有表单元素添加变更监听器
  Array.from(form.elements).forEach(element => {
    element.addEventListener('change', saveFormData);
    element.addEventListener('keyup', saveFormData);
  });
  
  // 在表单提交时清除已保存的数据
  form.addEventListener('submit', () => {
    localStorage.removeItem(storageKey);
  });
  
  // 添加重置按钮点击处理
  const resetButton = form.querySelector('button[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', clearFormData);
  }
  
  // 初始加载表单数据
  loadFormData();
  
  return {
    loadFormData,
    saveFormData,
    clearFormData
  };
}`}
              </code>
            </pre>
          </div>
        </section>
        
        <section id="limitations">
          <h2 className="text-2xl font-semibold mb-4">{t('limitations.title')}</h2>
          <p className="mb-4">
            {t('limitations.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('limitations.storageLimit')}</strong></li>
            <li><strong>{t('limitations.stringOnly')}</strong></li>
            <li><strong>{t('limitations.noExpiration')}</strong></li>
            <li><strong>{t('limitations.synchronous')}</strong></li>
            <li><strong>{t('limitations.securityPrivacy')}</strong></li>
            <li><strong>{t('limitations.browserSupport')}</strong></li>
            <li><strong>{t('limitations.serialization')}</strong></li>
          </ul>
        </section>
        
        <section id="best-practices">
          <h2 className="text-2xl font-semibold mb-4">{t('bestPractices.title')}</h2>
          
          <h3 className="font-medium mb-2">{t('bestPractices.errorHandling')}</h3>
          <p className="mb-4">
            {t('bestPractices.errorDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(\`Error retrieving \${key} from localStorage\`, e);
    return defaultValue;
  }
}`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('bestPractices.namespacing')}</h3>
          <p className="mb-4">
            {t('bestPractices.namespaceDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 使用应用前缀
const APP_PREFIX = 'myApp_';

function setItem(key, value) {
  localStorage.setItem(APP_PREFIX + key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(APP_PREFIX + key));
}

// 示例
setItem('userSettings', { theme: 'dark' }); // 存储在 'myApp_userSettings' 键下`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('bestPractices.versioning')}</h3>
          <p className="mb-4">
            {t('bestPractices.versioningDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 使用版本信息
function saveData(key, data, version = '1.0') {
  const versionedData = {
    data: data,
    version: version,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(versionedData));
}

function loadData(key, currentVersion = '1.0') {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    
    // 检查版本
    if (parsed.version !== currentVersion) {
      // 处理版本不匹配
      console.warn(\`Data version mismatch: stored=\${parsed.version}, current=\${currentVersion}\`);
      // 这里可以添加数据迁移逻辑
    }
    
    return parsed.data;
  } catch (e) {
    console.error('Error loading data', e);
    return null;
  }
}`}
              </code>
            </pre>
          </div>
          
          <h3 className="font-medium mb-2">{t('bestPractices.fallbacks')}</h3>
          <p className="mb-4">
            {t('bestPractices.fallbacksDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`// 始终提供默认值
function getUserSettings() {
  const defaults = {
    theme: 'light',
    fontSize: 'medium',
    showNotifications: true
  };
  
  try {
    const stored = localStorage.getItem('userSettings');
    
    if (!stored) return defaults;
    
    // 合并存储的设置与默认值
    return { ...defaults, ...JSON.parse(stored) };
  } catch (e) {
    // 出错时返回默认值
    console.error('Failed to load user settings', e);
    return defaults;
  }
}`}
              </code>
            </pre>
          </div>
        </section>
        
        <section id="alternatives">
          <h2 className="text-2xl font-semibold mb-4">{t('alternatives.title')}</h2>
          <p className="mb-4">
            {t('alternatives.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('alternatives.sessionStorage')}</strong></li>
            <li><strong>{t('alternatives.indexedDB')}</strong></li>
            <li><strong>{t('alternatives.cookies')}</strong></li>
            <li><strong>{t('alternatives.webSQL')}</strong></li>
            <li><strong>{t('alternatives.cacheAPI')}</strong></li>
            <li><strong>{t('alternatives.firebase')}</strong></li>
          </ul>
          
          <p className="mb-4">{t('alternatives.comparison')}</p>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border-b">技术</th>
                  <th className="px-4 py-2 border-b">容量</th>
                  <th className="px-4 py-2 border-b">复杂度</th>
                  <th className="px-4 py-2 border-b">持久性</th>
                  <th className="px-4 py-2 border-b">适用场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">LocalStorage</td>
                  <td className="px-4 py-2 border-b">~5MB</td>
                  <td className="px-4 py-2 border-b">低</td>
                  <td className="px-4 py-2 border-b">持久（除非清除）</td>
                  <td className="px-4 py-2 border-b">简单的用户偏好，小型应用状态</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">SessionStorage</td>
                  <td className="px-4 py-2 border-b">~5MB</td>
                  <td className="px-4 py-2 border-b">低</td>
                  <td className="px-4 py-2 border-b">会话期间</td>
                  <td className="px-4 py-2 border-b">表单数据，临时会话状态</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">IndexedDB</td>
                  <td className="px-4 py-2 border-b">无明确限制（较大）</td>
                  <td className="px-4 py-2 border-b">高</td>
                  <td className="px-4 py-2 border-b">持久（除非清除）</td>
                  <td className="px-4 py-2 border-b">复杂数据，离线应用</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Cookies</td>
                  <td className="px-4 py-2 border-b">4KB</td>
                  <td className="px-4 py-2 border-b">中</td>
                  <td className="px-4 py-2 border-b">可配置过期时间</td>
                  <td className="px-4 py-2 border-b">需要与服务器交互的数据</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Cache API</td>
                  <td className="px-4 py-2 border-b">无明确限制</td>
                  <td className="px-4 py-2 border-b">高</td>
                  <td className="px-4 py-2 border-b">持久（除非清除）</td>
                  <td className="px-4 py-2 border-b">离线资源，PWA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section id="conclusion">
          <h2 className="text-2xl font-semibold mb-4">{t('conclusion.title')}</h2>
          <p className="mb-4">
            {t('conclusion.description')}
          </p>
          <p className="font-medium mb-2">{t('conclusion.keyConcepts')}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('conclusion.concept1')}</li>
            <li>{t('conclusion.concept2')}</li>
            <li>{t('conclusion.concept3')}</li>
            <li>{t('conclusion.concept4')}</li>
            <li>{t('conclusion.concept5')}</li>
          </ul>
          <p className="mb-4">
            {t('conclusion.furtherReading')}
          </p>
        </section>
        
        <section id="related-tutorials">
          <h2 className="text-2xl font-semibold mb-4">{t('tutorials.title')}</h2>
          <p className="mb-4">
            {t('tutorials.otherTutorials')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><a href="../tutorials/json-basics" className="text-blue-600 hover:underline">{t('tutorials.jsonBasics')}</a></li>
            <li><a href="../tutorials/json-schema" className="text-blue-600 hover:underline">{t('tutorials.jsonSchema')}</a></li>
            {/* <li><a href="../tutorials/json-apis" className="text-blue-600 hover:underline">{t('tutorials.jsonAPIs')}</a></li> */}
          </ul>
        </section>
      </div>
    </div>
  );
} 