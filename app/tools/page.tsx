// app/tools/page.tsx
import { Suspense } from 'react';
import { ToolsContent } from './ToolsContent';

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All AI Tools</h1>
        <p className="text-gray-500">Loading tools...</p>
      </div>
    }>
      <ToolsContent />
    </Suspense>
  );
}