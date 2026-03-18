export type DevOps = 'Docker' | 'Kubernetes' | 'GitHub Actions';
export type Libraries = 'React' | 'Svelte' | 'TailwindCSS' | 'Axum' | 'Actix' | 'Prometheus' | 'Grafana';
export type Languages =
  | 'TypeScript'
  | 'Python'
  | 'Rust'
  | 'Go'
  | 'C++'
  | 'C'
  | 'C#'
  | 'PHP'
  | 'Ruby'
  | 'Java'
  | 'Kotlin';
export type Tag = 'web' | 'ai' | 'systems' | 'tooling' | 'personal' | 'backend';

export interface Project {
  title: string;
  image?: string;
  source_url?: string;
  techStack: {
    devops: DevOps[];
    libraries: Libraries[];
    languages: Languages[];
  };
  summary: string;
  description: string;
  tags: Tag[];
}

export const PROJECTS: Project[] = [
  {
    title: 'Project Alpha',
    image: '/images/project-alpha.png',
    source_url: 'https://example.com',
    techStack: {
      devops: ['Docker', 'GitHub Actions'],
      libraries: ['Svelte', 'TailwindCSS'],
      languages: ['TypeScript', 'Python']
    },
    summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. voluptatibus culpa possimus
reiciendis odio.`,
    tags: ['web', 'tooling']
  },
  {
    title: 'Project Beta',
    source_url: 'https://example.com',
    image: '/images/project-beta.png',
    techStack: {
      devops: ['Kubernetes'],
      libraries: ['React'],
      languages: ['TypeScript', 'Go']
    },
    summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. voluptatibus culpa possimus
reiciendis odio.`,
    tags: ['ai', 'systems']
  },
  {
    title: 'Project Gamma',
    source_url: 'https://example.com',
    image: '/images/project-gamma.png',
    techStack: {
      devops: [],
      libraries: ['Grafana'],
      languages: ['Python']
    },
    summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. Voluptatibus culpa possimus
reiciendis odio.`,
    tags: ['personal', 'web']
  },
  {
    title: 'Project Zetta',
    image: '/images/project-zetta.png',
    techStack: {
      devops: [],
      libraries: ['Actix'],
      languages: ['Rust']
    },
    summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. Voluptatibus culpa possimus
reiciendis odio.`,
    tags: ['backend', 'web']
  }
];
