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

export interface StackItem {
  name: string
  /** Inline SVG markup, recolored by CSS. */
  svg: string
}

export interface StackGroup {
  title: string
  items: StackItem[]
}

/** Devicon ships brand colors; dropping the fills lets the icons take the page colors. */
const mono = (svg: string) => svg.replace(/\sfill="[^"]*"/g, '')

/** Devicon has no generic SQL mark, so this is a plain stack of database discs. */
const sql =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"><ellipse cx="64" cy="30" rx="40" ry="14"/><path d="M24 30v68c0 7.7 17.9 14 40 14s40-6.3 40-14V30M24 64c0 7.7 17.9 14 40 14s40-6.3 40-14"/></g></svg>'

export const stack: StackGroup[] = [
  {
    title: 'Backend',
    items: [
      { name: 'PHP', svg: mono(php) },
      { name: 'Symfony', svg: mono(symfony) },
      { name: 'Java', svg: mono(java) }
    ]
  },
  {
    title: 'Frontend',
    items: [
      { name: 'Vue', svg: mono(vue) },
      { name: 'TypeScript', svg: mono(typescript) },
      { name: 'JavaScript', svg: mono(javascript) },
      { name: 'React', svg: mono(react) },
      { name: 'SCSS', svg: mono(sass) }
    ]
  },
  {
    title: 'Data',
    items: [
      { name: 'PostgreSQL', svg: mono(postgresql) },
      { name: 'SQL', svg: sql },
      { name: 'Supabase', svg: mono(supabase) }
    ]
  },
  {
    title: 'CMS',
    items: [{ name: 'WordPress', svg: mono(wordpress) }]
  }
]
