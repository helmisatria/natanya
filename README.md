<div align="center">
  <h1>🥳 Natanya</h1>
</div>

## Technologies

- ⚡️ Next.js 12
- ⚛️ React 18
- ✨ TypeScript
- 💨 Tailwind CSS 3 — Configured with CSS Variables to extend the **primary** color
- 💎 Pre-built Components — Components that will **automatically adapt** with your brand color, [check here for the demo](https://tsnext-tw.thcl.dev/components)
- 🃏 Jest — Configured for unit testing
- 📈 Absolute Import and Path Alias — Import components using `@/` prefix
- 📏 ESLint — Find and fix problems in your code, also will **auto sort** your imports
- 💖 Prettier — Format your code consistently
- 🐶 Husky & Lint Staged — Run scripts on your staged files before they are committed
- 🤖 Conventional Commit Lint — Make sure you & your teammates follow conventional commit
- ⏰ Release Please — Generate your changelog by activating the `release-please` workflow
- 👷 Github Actions — Lint your code on PR
- 🚘 Automatic Branch and Issue Autolink — Branch will be automatically created on issue **assign**, and auto linked on PR
- 🔥 Snippets — A collection of useful snippets
- 👀 Default Open Graph — Awesome open graph generated using [og](https://github.com/theodorusclarence/og), fork it and deploy!
- 🗺 Site Map — Automatically generate sitemap.xml
- 📦 Expansion Pack — Easily install common libraries, additional components, and configs

See the 👉 [feature details and changelog](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/blob/main/CHANGELOG.md) 👈 for more.

You can also check all of the **details and demos** on my blog post:

- [One-stop Starter to Maximize Efficiency on Next.js & Tailwind CSS Projects](https://theodorusclarence.com/blog/one-stop-starter)

### Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.

### Change defaults

There are some things you need to change including title, urls, favicons, etc.

Find all comments with !STARTERCONF, then follow the guide.

Don't forget to change the package name in package.json
