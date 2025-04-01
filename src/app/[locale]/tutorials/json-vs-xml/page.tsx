"use client";

import { useTranslations } from 'next-intl';
import BreadcrumbNav from '@/components/Breadcrumb';

export default function JsonVsXmlTutorial() {
  const t = useTranslations('xmlcompare');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav />
      
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

        <section id="syntax-comparison">
          <h2 className="text-2xl font-semibold mb-4">{t('syntaxComparison.title')}</h2>
          <p className="mb-4">
            {t('syntaxComparison.description')}
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">{t('syntaxComparison.jsonFormat')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`{
  "person": {
    "name": "张三",
    "age": 30,
    "email": "zhangsan@example.com",
    "address": {
      "city": "北京",
      "postcode": "100000"
    },
    "interests": ["编程", "阅读", "旅行"]
  }
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('syntaxComparison.xmlFormat')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-sm overflow-auto">
                  <code>
{`<person>
  <n>张三</n>
  <age>30</age>
  <email>zhangsan@example.com</email>
  <address>
    <city>北京</city>
    <postcode>100000</postcode>
  </address>
  <interests>
    <interest>编程</interest>
    <interest>阅读</interest>
    <interest>旅行</interest>
  </interests>
</person>`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
          <p className="mb-4">
            {t('syntaxDifferences.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('syntaxDifferences.item1')}</li>
            <li>{t('syntaxDifferences.item2')}</li>
            <li>{t('syntaxDifferences.item3')}</li>
            <li>{t('syntaxDifferences.item4')}</li>
          </ul>
        </section>

        <section id="key-differences">
          <h2 className="text-2xl font-semibold mb-4">{t('keyDifferences.title')}</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b">{t('keyDifferences.columns.feature')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b">{t('keyDifferences.columns.json')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b">{t('keyDifferences.columns.xml')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.syntax.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.syntax.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.syntax.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.fileSize.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.fileSize.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.fileSize.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.parsingSpeed.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.parsingSpeed.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.parsingSpeed.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.dataTypes.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.dataTypes.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.dataTypes.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.commentSupport.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.commentSupport.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.commentSupport.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.namespace.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.namespace.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.namespace.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.readability.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.readability.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.readability.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.languageSupport.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.languageSupport.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.languageSupport.xml')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r">{t('keyDifferences.validation.name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">{t('keyDifferences.validation.json')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t('keyDifferences.validation.xml')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="advantages-json">
          <h2 className="text-2xl font-semibold mb-4">{t('jsonAdvantages.title')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('jsonAdvantages.lightweight').split(':')[0]}:</strong> {t('jsonAdvantages.lightweight').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.easyParsing').split(':')[0]}:</strong> {t('jsonAdvantages.easyParsing').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.readableWritable').split(':')[0]}:</strong> {t('jsonAdvantages.readableWritable').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.javascriptIntegration').split(':')[0]}:</strong> {t('jsonAdvantages.javascriptIntegration').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.fasterParsing').split(':')[0]}:</strong> {t('jsonAdvantages.fasterParsing').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.arraySupport').split(':')[0]}:</strong> {t('jsonAdvantages.arraySupport').split(':')[1]}</li>
            <li><strong>{t('jsonAdvantages.popularInApis').split(':')[0]}:</strong> {t('jsonAdvantages.popularInApis').split(':')[1]}</li>
          </ul>
        </section>

        <section id="advantages-xml">
          <h2 className="text-2xl font-semibold mb-4">{t('xmlAdvantages.title')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>{t('xmlAdvantages.validation').split(':')[0]}:</strong> {t('xmlAdvantages.validation').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.namespaces').split(':')[0]}:</strong> {t('xmlAdvantages.namespaces').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.queryLanguage').split(':')[0]}:</strong> {t('xmlAdvantages.queryLanguage').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.comments').split(':')[0]}:</strong> {t('xmlAdvantages.comments').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.complexData').split(':')[0]}:</strong> {t('xmlAdvantages.complexData').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.ecosystem').split(':')[0]}:</strong> {t('xmlAdvantages.ecosystem').split(':')[1]}</li>
            <li><strong>{t('xmlAdvantages.selfDescribing').split(':')[0]}:</strong> {t('xmlAdvantages.selfDescribing').split(':')[1]}</li>
          </ul>
        </section>

        <section id="when-to-use">
          <h2 className="text-2xl font-semibold mb-4">{t('whenToUseJson.title')}</h2>
          <p className="mb-4">
            {t('whenToUseJson.description')}
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('whenToUseJson.webApps')}</li>
            <li>{t('whenToUseJson.fastParsing')}</li>
            <li>{t('whenToUseJson.simpleStructures')}</li>
            <li>{t('whenToUseJson.javascript')}</li>
            <li>{t('whenToUseJson.mobileApps')}</li>
            <li>{t('whenToUseJson.configFiles')}</li>
            <li>{t('whenToUseJson.bandwidth')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">{t('whenToUseXml.title')}</h2>
          <p className="mb-4">
            {t('whenToUseXml.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('whenToUseXml.strictValidation')}</li>
            <li>{t('whenToUseXml.complexStructures')}</li>
            <li>{t('whenToUseXml.namespaceNeeded')}</li>
            <li>{t('whenToUseXml.commentsNeeded')}</li>
            <li>{t('whenToUseXml.documentOriented')}</li>
            <li>{t('whenToUseXml.soapServices')}</li>
            <li>{t('whenToUseXml.xsltNeeded')}</li>
          </ul>
        </section>

        <section id="conversion">
          <h2 className="text-2xl font-semibold mb-4">{t('conversion.title')}</h2>
          <p className="mb-4">
            {t('conversion.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('conversion.ourTool')}</li>
            <li>{t('conversion.libraries')}</li>
            <li>{t('conversion.xslt')}</li>
          </ul>
          <p className="mb-4">
            {t('conversion.note')}
          </p>
        </section>

        <section id="conclusion">
          <h2 className="text-2xl font-semibold mb-4">{t('conclusion.title')}</h2>
          <p className="mb-4">
            {t('conclusion.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('conclusion.chooseJson')}</li>
            <li>{t('conclusion.chooseXml')}</li>
          </ul>
          <p className="mb-4">
            {t('conclusion.modernDev')}
          </p>
          <p>
            {t('conclusion.finalThought')}
          </p>
        </section>
      </div>
    </div>
  );
} 