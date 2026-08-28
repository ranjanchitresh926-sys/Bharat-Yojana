import React from 'react';

// Metadata for this route lives in page.tsx (it needs to be more specific
// than this layout's, and Next.js only needs one source of truth — having
// it in both places here previously was redundant and confusing).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
