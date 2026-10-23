// Lets TypeScript accept side-effect CSS imports such as `import '@/app/ui/global.css'`.
// Next.js handles the CSS at bundle time; this only tells the type checker the module exists.
declare module '*.css';
