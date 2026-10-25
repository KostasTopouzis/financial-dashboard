* Code execution environments (client vs server) and their ramifications.
* Network boundaries between client and server.
* Routing mechanisms and models (routing libraries, file-system routing as in Next.js, server-side routing) and their difference from endpoint APIs.
- Particular emphasis on the file-system routing mechanism of Next.js, route segments, colocation, partial rendering, and layout pages.
* CSS styling methods in a Next.js environment: CSS frameworks (like Tailwind, Bulma, etc.) and CSS modules.
* Mention of the `clsx` library.
- Font optimization with the `next/font` module. The **Cumulative Layout Shift** metric.
- Image optimization with the `next/image` module and the `<Image>` Component.
- Various ways to fetch data and communicate with a database (APIs, SQL queries, ORMs, or Server Components).
- React Server Components and their benefits.
- Request waterfalls and their consequences.
- Static vs dynamic rendering.
- Streaming, when it is useful, and how to implement it in Next.js with `loading.tsx` and React `Suspense`.
- Suspense boundaries and use cases demonstrating their significance.
- Loading skeletons.
- Next.js Route Groups, parenthesized folders and their significance.
- Interruptable navigation.