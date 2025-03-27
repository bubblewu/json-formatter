import { promises as fs } from 'fs';
import path from 'path';
import { useTranslations } from 'next-intl';

interface Feedback {
  id: string;
  feedback: string;
  contact: string;
  userId: string;
  timestamp: string;
}

async function getFeedbacks(): Promise<Feedback[]> {
  const feedbackDir = path.join(process.cwd(), 'data', 'feedback');
  try {
    const files = await fs.readdir(feedbackDir);
    const feedbacks = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(feedbackDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
      })
    );
    return feedbacks.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error reading feedback files:', error);
    return [];
  }
}

export default async function FeedbackList() {
  const t = useTranslations();
  const feedbacks = await getFeedbacks();

  if (feedbacks.length === 0) {
    return (
      <div className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
        暂无反馈
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {feedbacks.map((feedback) => (
        <li key={feedback.id} className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(feedback.timestamp).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {feedback.userId}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {feedback.feedback}
            </p>
            {feedback.contact && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                联系方式: {feedback.contact}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
} 