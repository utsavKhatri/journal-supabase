/**
 * This file contains the data access layer for the application.
 * It provides functions to interact with the Supabase database for server-side operations.
 */
import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { redirect } from 'next/navigation';

/**
 * Fetches journal entries for a user with pagination, filtering by month/year, and search query.
 */
export const getJournalEntries = async ({
  user,
  searchParams,
}: {
  user: User;
  searchParams:
    | {
        page?: string | undefined;
        month?: string | undefined;
        year?: string | undefined;
        q?: string | undefined;
        date?: string | undefined;
      }
    | undefined;
}) => {
  const supabase = await createClient();
  const now = new Date();
  const pageNum = parseInt(searchParams?.page ?? '', 10);
  const page = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const itemsPerPage = 7;

  const monthNum = parseInt(searchParams?.month ?? '', 10);
  const yearNum = parseInt(searchParams?.year ?? '', 10);
  const month = Number.isNaN(monthNum)
    ? now.getMonth()
    : Math.max(0, Math.min(11, monthNum));
  const year = Number.isNaN(yearNum) ? now.getFullYear() : yearNum;

  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  let startDate = format(monthStart, 'yyyy-MM-dd');
  let endDate = format(monthEnd, 'yyyy-MM-dd');

  if (searchParams?.date) {
    startDate = searchParams.date;
    endDate = searchParams.date;
  }

  const q = (searchParams?.q ?? '').trim();
  const hasQuery = q.length > 0;

  const countQuery = supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  if (hasQuery) {
    countQuery.or(`content.ilike.%${q}%,mood.ilike.%${q}%`);
  }

  const { count: totalCount, error: countError } = await countQuery;

  if (countError) throw countError;

  const dataQuery = supabase
    .from('entries')
    .select('id, date, mood, content, created_at')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  if (hasQuery) {
    dataQuery.or(`content.ilike.%${q}%,mood.ilike.%${q}%`);
  }

  const { data: entries, error: entriesError } = await dataQuery
    .order('date', { ascending: false })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  if (entriesError) throw entriesError;

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return { entries, totalCount, totalPages, page, itemsPerPage, month, year };
};

/**
 * Fetches the data required for the Insights page.
 * This includes all journal entries for the mood and weekly activity charts,
 * and the entries for the selected month for the calendar view.
 */
export const getInsightsPageData = async (searchParams?: {
  month?: string;
  year?: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Determine the month and year from search parameters or default to the current date.
  const now = new Date();
  const monthNum = parseInt(searchParams?.month ?? '', 10);
  const yearNum = parseInt(searchParams?.year ?? '', 10);
  const month = Number.isNaN(monthNum)
    ? now.getMonth()
    : Math.max(0, Math.min(11, monthNum));
  const year = Number.isNaN(yearNum) ? now.getFullYear() : yearNum;

  // Calculate the start and end dates for the selected month to filter calendar entries.
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const startDate = format(monthStart, 'yyyy-MM-dd');
  const endDate = format(monthEnd, 'yyyy-MM-dd');

  // Fetch all journal entries for mood and weekly activity charts.
  const entriesPromise = supabase
    .from('entries')
    .select('id, mood, date')
    .eq('user_id', user.id);

  // Fetch journal entries specifically for the selected month to display in the calendar.
  const calendarPromise = supabase
    .from('entries')
    .select('id, date')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  // Execute both data fetching promises in parallel for efficiency.
  const [{ data: entries }, { data: calendarEntries }] = await Promise.all([
    entriesPromise,
    calendarPromise,
  ]);

  return { entries, calendarEntries, month, year };
};
