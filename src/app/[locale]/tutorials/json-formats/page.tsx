"use client";

import { useTranslations } from 'next-intl';

export default function JsonFormatsTutorial() {
  const t = useTranslations('formats');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('pageTitle')}</h1>
      
      <div className="space-y-12">
        <section id="introduction">
          <h2 className="text-2xl font-semibold mb-4">{t('introduction.title')}</h2>
          <p className="mb-4">
            {t('introduction.description')}
          </p>
          <p className="mb-4">
            {t('detailedDescription')}
          </p>
        </section>

        <section id="indentation">
          <h2 className="text-2xl font-semibold mb-4">{t('indentation.title')}</h2>
          <p className="mb-4">
            {t('indentation.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('indentation.guideline1')}</li>
            <li>{t('indentation.guideline2')}</li>
            <li>{t('indentation.guideline3')}</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">{t('indentation.recommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "name": "张三",
  "age": 30,
  "address": {
    "city": "上海",
    "street": "南京路"
  },
  "skills": [
    "JavaScript",
    "HTML",
    "CSS"
  ]
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('indentation.notRecommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
"name": "张三",
    "age": 30,
  "address": {
  "city": "上海",
      "street": "南京路"},
  "skills": ["JavaScript", "HTML",
"CSS"]
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="naming-conventions">
          <h2 className="text-2xl font-semibold mb-4">{t('namingConventions.title')}</h2>
          <p className="mb-4">
            {t('namingConventions.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('namingConventions.camelCase')}</strong></li>
            <li><strong>{t('namingConventions.avoidUnderscores')}</strong></li>
            <li><strong>{t('namingConventions.descriptiveNames')}</strong></li>
            <li><strong>{t('namingConventions.avoidAbbreviations')}</strong></li>
            <li><strong>{t('namingConventions.consistency')}</strong></li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">{t('namingConventions.recommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "firstName": "张",
  "lastName": "三",
  "emailAddress": "zhangsan@example.com",
  "lastLoginTime": "2023-05-15T14:30:00Z"
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('namingConventions.notRecommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "first_name": "张",
  "LastName": "三",
  "email": "zhangsan@example.com",
  "last_lgn": "2023-05-15T14:30:00Z"
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="data-organization">
          <h2 className="text-2xl font-semibold mb-4">{t('dataOrganization.title')}</h2>
          <p className="mb-4">
            {t('dataOrganization.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('dataOrganization.groupRelated')}</strong></li>
            <li><strong>{t('dataOrganization.logicalOrder')}</strong></li>
            <li><strong>{t('dataOrganization.consistentTypes')}</strong></li>
            <li><strong>{t('dataOrganization.arrayItems')}</strong></li>
          </ul>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`{
  "id": 12345,
  "name": "张三",
  "contactInfo": {
    "email": "zhangsan@example.com",
    "phone": "123-456-7890"
  },
  "address": {
    "street": "南京路100号",
    "city": "上海",
    "province": "上海",
    "postalCode": "200001"
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "orderDate": "2023-01-15",
      "total": 299.99
    },
    {
      "orderId": "ORD-002",
      "orderDate": "2023-03-20",
      "total": 149.50
    }
  ]
}`}
              </code>
            </pre>
          </div>
        </section>

        <section id="date-number-formats">
          <h2 className="text-2xl font-semibold mb-4">{t('dateNumberFormats.title')}</h2>
          <p className="mb-4">
            {t('dateNumberFormats.description')}
          </p>
          <h3 className="font-medium mb-2">{t('dateNumberFormats.dateFormats')}</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('dateNumberFormats.useISO')}</li>
            <li>{t('dateNumberFormats.example')}</li>
            <li>{t('dateNumberFormats.avoidLocalized')}</li>
          </ul>
          
          <h3 className="font-medium mb-2">{t('dateNumberFormats.numberFormats')}</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('dateNumberFormats.avoidSeparators')}</li>
            <li>{t('dateNumberFormats.currencyPrecision')}</li>
            <li>{t('dateNumberFormats.largeNumbers')}</li>
          </ul>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-auto">
              <code>
{`{
  "createdAt": "2023-05-15T14:30:00Z",
  "lastUpdate": "2023-06-02T09:15:30+08:00",
  "price": 1299.99,
  "quantity": 25,
  "largeNumber": "9007199254740992"
}`}
              </code>
            </pre>
          </div>
        </section>

        <section id="validation">
          <h2 className="text-2xl font-semibold mb-4">{t('validation.title')}</h2>
          <p className="mb-4">
            {t('validation.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('validation.useTools')}</strong></li>
            <li><strong>{t('validation.useSchema')}</strong></li>
            <li><strong>{t('validation.checkErrors')}</strong></li>
            <li><strong>{t('validation.autoFormat')}</strong></li>
          </ul>
          <p className="mb-4">
            {t('validation.ourTool')}
          </p>
        </section>

        <section id="compression">
          <h2 className="text-2xl font-semibold mb-4">{t('compression.title')}</h2>
          <p className="mb-4">
            {t('compression.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('compression.devDebug')}</strong></li>
            <li><strong>{t('compression.production')}</strong></li>
            <li><strong>{t('compression.apiResponses')}</strong></li>
            <li><strong>{t('compression.largeFiles')}</strong></li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">{t('compression.beautified')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "name": "张三",
  "age": 30,
  "email": "zhangsan@example.com"
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('compression.compressed')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{"name":"张三","age":30,"email":"zhangsan@example.com"}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="whitespace-placement">
          <h2 className="text-2xl font-semibold mb-4">{t('whitespacePlacement.title')}</h2>
          <p className="mb-4">
            {t('whitespacePlacement.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('whitespacePlacement.afterColons')}</li>
            <li>{t('whitespacePlacement.afterCommas')}</li>
            <li>{t('whitespacePlacement.noExtraSpaces')}</li>
            <li>{t('whitespacePlacement.lineBreaks')}</li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">{t('whitespacePlacement.recommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "name": "张三",
  "interests": ["编程", "阅读", "旅行"],
  "address": {
    "city": "北京",
    "street": "朝阳区"
  }
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('whitespacePlacement.notRecommended')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "name":"张三",
  "interests":[ "编程","阅读" , "旅行" ],
  "address":{ "city" : "北京" ,"street":"朝阳区"}
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="security-considerations">
          <h2 className="text-2xl font-semibold mb-4">{t('securityConsiderations.title')}</h2>
          <p className="mb-4">
            {t('securityConsiderations.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('securityConsiderations.sensitiveData')}</li>
            <li>{t('securityConsiderations.validateInput')}</li>
            <li>{t('securityConsiderations.avoidComments')}</li>
            <li>{t('securityConsiderations.handleErrors')}</li>
          </ul>
        </section>

        <section id="tools">
          <h2 className="text-2xl font-semibold mb-4">{t('tools.title')}</h2>
          <p className="mb-4">
            {t('tools.description')}
          </p>
          
          <h3 className="font-medium mb-2">{t('tools.onlineTools')}</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('tools.ourFormatter')}</strong></li>
            <li><strong>{t('tools.jsonlint')}</strong></li>
          </ul>
          
          <h3 className="font-medium mb-2">{t('tools.editorPlugins')}</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('tools.vscode')}</strong></li>
            <li><strong>{t('tools.webstorm')}</strong></li>
            <li><strong>{t('tools.sublime')}</strong></li>
          </ul>
          
          <h3 className="font-medium mb-2">{t('tools.cliTools')}</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('tools.jq')}</strong></li>
            <li><strong>{t('tools.prettier')}</strong></li>
          </ul>
        </section>

        <section id="best-practices-summary">
          <h2 className="text-2xl font-semibold mb-4">{t('bestPractices.title')}</h2>
          <p className="mb-4">
            {t('bestPractices.description')}
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>{t('bestPractices.point1')}</li>
            <li>{t('bestPractices.point2')}</li>
            <li>{t('bestPractices.point3')}</li>
            <li>{t('bestPractices.point4')}</li>
            <li>{t('bestPractices.point5')}</li>
            <li>{t('bestPractices.point6')}</li>
            <li>{t('bestPractices.point7')}</li>
            <li>{t('bestPractices.point8')}</li>
            <li>{t('bestPractices.point9')}</li>
          </ol>
        </section>

        <section id="conclusion">
          <h2 className="text-2xl font-semibold mb-4">{t('conclusion.title')}</h2>
          <p className="mb-4">
            {t('conclusion.description')}
          </p>
          <p className="mb-4">
            {t('conclusion.nextSteps')}
          </p>
        </section>
      </div>
    </div>
  );
} 