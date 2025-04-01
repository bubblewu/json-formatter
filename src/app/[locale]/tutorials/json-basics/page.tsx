"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function JsonBasicsPage() {
  const t = useTranslations('basics');
  
  // 动画配置
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // 示例代码
  const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isEmployee": true,
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zipCode": "02101"
  },
  "phoneNumbers": [
    "555-1234",
    "555-5678"
  ],
  "languages": ["English", "Spanish"],
  "spouse": null
}`;

  const jsonArrayExample = `[
  {
    "id": 1,
    "name": "Alice",
    "skills": ["JavaScript", "React"]
  },
  {
    "id": 2,
    "name": "Bob",
    "skills": ["Python", "Django"]
  }
]`;

  const jsonStringExample = `"This is a string value in JSON"`;

  const jsonNumberExample = `42
3.14159
-273.15`;

  const jsonBooleanExample = `true
false`;

  const jsonNullExample = `null`;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <header className="mb-12">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4">
            <span className="text-4xl mr-3">📝</span>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              初级
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('introduction.description')}
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <section className="mb-12">
            <h2 className="group flex items-center" id="what-is-json">
              {t('whatIsJson.title')}
              <a href="#what-is-json" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('whatIsJson.description')}
            </p>
            <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-blue-700 dark:text-blue-400 font-medium mb-2">{t('whatIsJson.keyFeatures.title')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('whatIsJson.keyFeatures.item1')}</li>
                <li>{t('whatIsJson.keyFeatures.item2')}</li>
                <li>{t('whatIsJson.keyFeatures.item3')}</li>
                <li>{t('whatIsJson.keyFeatures.item4')}</li>
                <li>{t('whatIsJson.keyFeatures.item5')}</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-syntax">
              {t('jsonSyntax.title')}
              <a href="#json-syntax" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('jsonSyntax.description')}
            </p>
            <ul>
              <li>{t('jsonSyntax.rule1')}</li>
              <li>{t('jsonSyntax.rule2')}</li>
              <li>{t('jsonSyntax.rule3')}</li>
              <li>{t('jsonSyntax.rule4')}</li>
              <li>{t('jsonSyntax.rule5')}</li>
            </ul>
            <p>
              {t('jsonSyntax.completeExample')}
            </p>
            <div className="mb-6">
              <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg">
                {jsonExample}
              </SyntaxHighlighter>
            </div>
            <p>
              {t('jsonSyntax.validJson')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-data-types">
              {t('jsonDataTypes.title')}
              <a href="#json-data-types" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('jsonDataTypes.description')}
            </p>
            
            <h3>{t('jsonDataTypes.string')}</h3>
            <p>
              {t('jsonDataTypes.stringDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonStringExample}
            </SyntaxHighlighter>
            
            <h3>{t('jsonDataTypes.number')}</h3>
            <p>
              {t('jsonDataTypes.numberDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonNumberExample}
            </SyntaxHighlighter>
            
            <h3>{t('jsonDataTypes.boolean')}</h3>
            <p>
              {t('jsonDataTypes.booleanDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonBooleanExample}
            </SyntaxHighlighter>
            
            <h3>{t('jsonDataTypes.null')}</h3>
            <p>
              {t('jsonDataTypes.nullDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonNullExample}
            </SyntaxHighlighter>
            
            <h3>{t('jsonDataTypes.object')}</h3>
            <p>
              {t('jsonDataTypes.objectDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4" showLineNumbers>
              {`{
  "name": "John Doe",
  "age": 30,
  "isEmployee": true
}`}
            </SyntaxHighlighter>
            
            <h3>{t('jsonDataTypes.array')}</h3>
            <p>
              {t('jsonDataTypes.arrayDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonArrayExample}
            </SyntaxHighlighter>
            
            <div className="bg-yellow-50 dark:bg-amber-900 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
              <h4 className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">{t('jsonDataTypes.noteTitle')}</h4>
              <p className="text-yellow-800 dark:text-yellow-200 mb-0">
                {t('jsonDataTypes.noteDescription')}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-yellow-800 dark:text-yellow-200">
                <li>{t('jsonDataTypes.noteItem1')}</li>
                <li>{t('jsonDataTypes.noteItem2')}</li>
                <li>{t('jsonDataTypes.noteItem3')}</li>
                <li>{t('jsonDataTypes.noteItem4')}</li>
                <li>{t('jsonDataTypes.noteItem5')}</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-structure">
              {t('jsonStructure.title')}
              <a href="#json-structure" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('jsonStructure.description')}
            </p>
            <p>
              {t('jsonStructure.exampleDescription')}
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-6" showLineNumbers>
              {`{
  "id": 1,
  "name": "Product Catalog",
  "categories": [
    {
      "id": 101,
      "name": "Electronics",
      "products": [
        {
          "id": 1001,
          "name": "Smartphone",
          "price": 699.99,
          "specs": {
            "cpu": "Octa-core",
            "ram": "8GB",
            "storage": "128GB"
          },
          "inStock": true,
          "colors": ["Black", "White", "Blue"]
        },
        {
          "id": 1002,
          "name": "Laptop",
          "price": 1299.99,
          "specs": {
            "cpu": "Quad-core",
            "ram": "16GB",
            "storage": "512GB SSD"
          },
          "inStock": false,
          "colors": ["Silver", "Gray"]
        }
      ]
    }
  ],
  "lastUpdated": "2023-04-01T10:30:00Z"
}`}
            </SyntaxHighlighter>
            <p>
              {t('jsonStructure.exampleExplanation')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="common-mistakes">
              {t('commonMistakes.title')}
              <a href="#common-mistakes" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('commonMistakes.description')}
            </p>
            
            <h3>{t('commonMistakes.commonErrors')}</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">{t('commonMistakes.error1')}</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{ 'name': 'John' }`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {t('commonMistakes.error1Description')}
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">{t('commonMistakes.error2')}</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  "name": "John",
  "age": 30,
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {t('commonMistakes.error2Description')}
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">{t('commonMistakes.error3')}</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  name: "John"
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {t('commonMistakes.error3Description')}
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">{t('commonMistakes.error4')}</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  // User info
  "name": "John"
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  {t('commonMistakes.error4Description')}
                </p>
              </div>
            </div>
            
            <h3>{t('commonMistakes.bestPractices')}</h3>
            <ul>
              <li><strong>{t('commonMistakes.bestPractice1')}</strong> - {t('commonMistakes.bestPractice1Description')}</li>
              <li><strong>{t('commonMistakes.bestPractice2')}</strong> - {t('commonMistakes.bestPractice2Description')}</li>
              <li><strong>{t('commonMistakes.bestPractice3')}</strong> - {t('commonMistakes.bestPractice3Description')}</li>
              <li><strong>{t('commonMistakes.bestPractice4')}</strong> - {t('commonMistakes.bestPractice4Description')}</li>
              <li><strong>{t('commonMistakes.bestPractice5')}</strong> - {t('commonMistakes.bestPractice5Description')}</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="group flex items-center" id="tools-libraries">
              {t('toolsLibraries.title')}
              <a href="#tools-libraries" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('toolsLibraries.description')}
            </p>
            
            <h3>{t('toolsLibraries.onlineTools')}</h3>
            <ul>
              <li><strong>{t('toolsLibraries.tool1')}</strong> - {t('toolsLibraries.tool1Description')}</li>
              <li><strong>{t('toolsLibraries.tool2')}</strong> - {t('toolsLibraries.tool2Description')}</li>
              <li><strong>{t('toolsLibraries.tool3')}</strong> - {t('toolsLibraries.tool3Description')}</li>
              <li><strong>{t('toolsLibraries.tool4')}</strong> - {t('toolsLibraries.tool4Description')}</li>
            </ul>
            
            <h3>{t('toolsLibraries.programmingLibraries')}</h3>
            <div className="grid md:grid-cols-3 gap-4 my-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('toolsLibraries.library1')}</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>{t('toolsLibraries.library1Item1')}</li>
                  <li>{t('toolsLibraries.library1Item2')}</li>
                  <li>{t('toolsLibraries.library1Item3')}</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('toolsLibraries.library2')}</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>{t('toolsLibraries.library2Item1')}</li>
                  <li>{t('toolsLibraries.library2Item2')}</li>
                  <li>{t('toolsLibraries.library2Item3')}</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('toolsLibraries.library3')}</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>{t('toolsLibraries.library3Item1')}</li>
                  <li>{t('toolsLibraries.library3Item2')}</li>
                  <li>{t('toolsLibraries.library3Item3')}</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="group flex items-center" id="conclusion">
              {t('conclusion.title')}
              <a href="#conclusion" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              {t('conclusion.description')}
            </p>
            <ul>
              <li>{t('conclusion.item1')}</li>
              <li>{t('conclusion.item2')}</li>
              <li>{t('conclusion.item3')}</li>
              <li>{t('conclusion.item4')}</li>
              <li>{t('conclusion.item5')}</li>
            </ul>
            <p>
              {t('conclusion.finalDescription')}
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Link href="/tutorials" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {t('returnToTutorials')}
            </Link>
            
            <Link href="/tutorials/json-schema" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {t('nextTutorial')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 