import java from 'devicon/icons/java/java-plain.svg?raw'
import javascript from 'devicon/icons/javascript/javascript-plain.svg?raw'
import php from 'devicon/icons/php/php-plain.svg?raw'
import postgresql from 'devicon/icons/postgresql/postgresql-plain.svg?raw'
import react from 'devicon/icons/react/react-original.svg?raw'
import sass from 'devicon/icons/sass/sass-original.svg?raw'
import supabase from 'devicon/icons/supabase/supabase-plain.svg?raw'
import symfony from 'devicon/icons/symfony/symfony-original.svg?raw'
import typescript from 'devicon/icons/typescript/typescript-plain.svg?raw'
import vue from 'devicon/icons/vuejs/vuejs-plain.svg?raw'
import wordpress from 'devicon/icons/wordpress/wordpress-plain.svg?raw'

export interface TechItem {
  name: string
  /** Inline SVG markup, recolored by CSS. */
  svg: string
  /** Position inside the cloud, in percent. */
  x: number
  y: number
  /** Tile width as a share of the cloud: size x 2.4 percent. */
  size: number
  /** How strongly the tile follows the cursor and the scroll. */
  depth: number
}

/** Devicon ships brand colors; dropping the fills lets the tiles take the page colors. */
const mono = (svg: string) => svg.replace(/\sfill="[^"]*"/g, '')

/** Devicon has no generic SQL mark, so this is a plain stack of database discs. */
const sql =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"><ellipse cx="64" cy="30" rx="40" ry="14"/><path d="M24 30v68c0 7.7 17.9 14 40 14s40-6.3 40-14V30M24 64c0 7.7 17.9 14 40 14s40-6.3 40-14"/></g></svg>'

export const tech: TechItem[] = [
  { name: 'PHP', svg: mono(php), x: 4, y: 2, size: 6, depth: 0.6 },
  { name: 'Symfony', svg: mono(symfony), x: 28, y: 12, size: 4.5, depth: 1 },
  { name: 'Vue', svg: mono(vue), x: 50, y: 0, size: 6.5, depth: 0.8 },
  { name: 'TypeScript', svg: mono(typescript), x: 77, y: 8, size: 5, depth: 1.1 },
  { name: 'JavaScript', svg: mono(javascript), x: 16, y: 36, size: 5, depth: 0.9 },
  { name: 'Java', svg: mono(java), x: 40, y: 34, size: 5, depth: 0.75 },
  { name: 'WordPress', svg: mono(wordpress), x: 62, y: 38, size: 5.5, depth: 0.7 },
  { name: 'SCSS', svg: mono(sass), x: 84, y: 36, size: 4.5, depth: 1.15 },
  { name: 'React', svg: mono(react), x: 22, y: 66, size: 4.5, depth: 1.2 },
  { name: 'PostgreSQL', svg: mono(postgresql), x: 44, y: 64, size: 5.5, depth: 0.85 },
  { name: 'Supabase', svg: mono(supabase), x: 68, y: 70, size: 5, depth: 0.95 },
  { name: 'SQL', svg: sql, x: 86, y: 62, size: 4.5, depth: 1.05 }
]
