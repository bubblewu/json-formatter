"use client";

import { useTranslations } from 'next-intl';
import BreadcrumbNav from '@/components/Breadcrumb';
import MetadataClient from './metadata.client';

export default function JsonSchemaTutorial() {
  const t = useTranslations('schema');
  
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
        </section>

        <section id="basics">
          <h2 className="text-2xl font-semibold mb-4">{t('basics.title')}</h2>
          <p className="mb-4">
            {t('basics.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>What data types are allowed</li>
            <li>Required and optional properties</li>
            <li>Data constraints and validation rules</li>
            <li>Nested object structures</li>
          </ul>
        </section>

        <section id="validation">
          <h2 className="text-2xl font-semibold mb-4">{t('validation.title')}</h2>
          <p className="mb-4">
            {t('validation.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Ensure data conforms to expected formats</li>
            <li>Reject invalid data before processing</li>
            <li>Provide clear error messages when validation fails</li>
          </ul>
        </section>

        <section id="advanced">
          <h2 className="text-2xl font-semibold mb-4">{t('advanced.title')}</h2>
          <p className="mb-4">
            {t('advanced.description')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>References and definitions for reusable schema components</li>
            <li>Conditional validation using if-then-else</li>
            <li>Format validation for common data types</li>
            <li>Custom vocabularies and extensions</li>
          </ul>
        </section>

        <section id="tools">
          <h2 className="text-2xl font-semibold mb-4">{t('tools.title')}</h2>
          <p className="mb-4">
            {t('tools.description')}
          </p>
          <ul className="list-disc pl-6">
            <li>Ajv - A JSON Schema validator for JavaScript</li>
            <li>JsonSchema.Net - Online schema generator and validator</li>
            <li>json-schema-validator - Java-based validator</li>
            <li>Schema Registry tools for API development</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 