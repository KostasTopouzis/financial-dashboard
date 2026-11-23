import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { fetchRevenue } from '@/app/lib/data';
import clsx from 'clsx';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue();

  const chartHeight = 350;

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-muted">No revenue recorded yet.</p>;
  }

  const { yAxisLabels, topLabel } = generateYAxis(revenue);
  const lastIndex = revenue.length - 1;

  return (
    <section
      aria-labelledby="revenue-heading"
      className="flex w-full flex-col rounded border border-line bg-surface p-5 md:col-span-4"
    >
      <div className="mb-5 flex items-baseline justify-between gap-2">
        <h2
          id="revenue-heading"
          className="font-display text-2xl font-semibold text-ink"
        >
          Revenue
        </h2>
        <p className="text-sm text-muted">By month</p>
      </div>

      <div className="sm:grid-cols-13 grid grid-cols-12 items-end gap-2 md:gap-3">
        <div
          className="mb-6 hidden flex-col justify-between text-right text-xs font-figures tabular-nums text-muted sm:flex"
          style={{ height: `${chartHeight}px` }}
          aria-hidden="true"
        >
          {yAxisLabels.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>

        {revenue.map((month, i) => (
          <div key={month.month} className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                'w-full rounded-t-sm',
                i === lastIndex ? 'bg-accent' : 'bg-primary',
              )}
              style={{
                height: `${(chartHeight / topLabel) * month.revenue}px`,
              }}
              title={`${month.month}: $${month.revenue.toLocaleString('en-US')}`}
            ></div>
            <p
              className={clsx(
                '-rotate-90 text-xs sm:rotate-0',
                i === lastIndex ? 'font-semibold text-ink' : 'text-muted',
              )}
            >
              {month.month}
            </p>
          </div>
        ))}
      </div>

      {/* Text equivalent of the bars for screen readers */}
      <table className="sr-only">
        <caption>Revenue by month, last 12 months</caption>
        <tbody>
          {revenue.map((month) => (
            <tr key={month.month}>
              <th scope="row">{month.month}</th>
              <td>${month.revenue.toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-sm text-muted">
        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        Last 12 months · most recent month highlighted
      </div>
    </section>
  );
}
