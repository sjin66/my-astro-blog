// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://sjin66.github.io', // 你的 GitHub Pages URL
  	base: '/my-astro-blog', // 如果你的仓库名不是 username.github.io，需要设置 base
	integrations: [mdx(), sitemap()],
});
