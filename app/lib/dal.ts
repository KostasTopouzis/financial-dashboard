// Data Access Layer: the single place that decides who the current user
// is. Every query and Server Action asks this module for the user id
// instead of trusting an id sent by the browser, so a user can only ever
// read or change rows in their own workspace.
import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export type WorkspaceUser = {
  id: string;
  name: string | null;
  email: string | null;
};

// `cache` runs auth() once per request, even though the cards, chart and
// invoice list on one page each call requireUser() separately.
export const requireUser = cache(async (): Promise<WorkspaceUser> => {
  const session = await auth();
  const id = session?.user?.id;

  // No session (or an old one without an id): send the visitor to log in.
  // redirect() throws, so nothing after this line runs for them.
  if (!id) redirect('/login');

  return {
    id,
    name: session?.user?.name ?? null,
    email: session?.user?.email ?? null,
  };
});
