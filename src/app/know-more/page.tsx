import { Metadata } from 'next';
import { KnowMoreContent } from '@/components/pages/know-more-content';

export const metadata: Metadata = {
  title: 'Know More - Thumboard',
  description: 'Learn about Thumboard, our journey, and get in touch with our team.',
};

export default function KnowMorePage() {
  return (
    <div className="min-h-screen bg-background">
      <KnowMoreContent />
    </div>
  );
}
