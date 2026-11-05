export const themes = [
  {
    id: 'dark',
    name: 'Dark',
    mode: 'dark',
    description: 'Deep charcoal with indigo and pink energy.',
    colors: { bg: '#0a0a0f', surface: '#13131c', fg: '#f4f4f8', muted: '#9a9ab0', line: '#26263a', primary: '#6366f1', accent: '#ec4899' },
  },
  {
    id: 'light',
    name: 'Light',
    mode: 'light',
    description: 'Clean, crisp and airy for daytime work.',
    colors: { bg: '#f8fafc', surface: '#ffffff', fg: '#0f172a', muted: '#64748b', line: '#e2e8f0', primary: '#4f46e5', accent: '#db2777' },
  },
  {
    id: 'neon',
    name: 'Neon',
    mode: 'dark',
    description: 'Cyber-green and magenta on near-black violet.',
    colors: { bg: '#05010d', surface: '#0d0420', fg: '#f0fff8', muted: '#8ba3a0', line: '#2a0f4d', primary: '#00ffa3', accent: '#ff00e5' },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    mode: 'dark',
    description: 'Forest greens with a lime spark.',
    colors: { bg: '#04120d', surface: '#082219', fg: '#ecfdf5', muted: '#86b5a2', line: '#12392b', primary: '#10b981', accent: '#84cc16' },
  },
  {
    id: 'purple',
    name: 'Purple',
    mode: 'dark',
    description: 'Royal violet with candy pink highlights.',
    colors: { bg: '#0f0720', surface: '#1a0f33', fg: '#f5f3ff', muted: '#a79bd0', line: '#2e1f5a', primary: '#a855f7', accent: '#f472b6' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    mode: 'dark',
    description: 'Navy night sky with sky-blue accents.',
    colors: { bg: '#020617', surface: '#0b1224', fg: '#e2e8f0', muted: '#7c8aa5', line: '#1b2640', primary: '#38bdf8', accent: '#818cf8' },
  },
  {
    id: 'glass',
    name: 'Glass',
    mode: 'dark',
    description: 'Frosted surfaces over glowing gradients.',
    colors: { bg: '#0b1020', surface: '#1a2238', fg: '#ffffff', muted: '#a5b0cc', line: '#3a4668', primary: '#22d3ee', accent: '#c084fc' },
  },
]

export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function hexToRgbString(hex) {
  const [r, g, b] = hexToRgb(hex)
  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}

export function applyTheme(themeId) {
  const theme = themes.find((t) => t.id === themeId) || themes[0]
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, hex]) => {
    root.style.setProperty('--' + key, hexToRgb(hex).join(' '))
  })
  root.setAttribute('data-theme', theme.id)
  root.style.colorScheme = theme.mode
}

export function themeToCssVariables(theme) {
  const lines = Object.entries(theme.colors).map(
    ([key, hex]) => '  --' + key + ': ' + hexToRgb(hex).join(' ') + ';  /* ' + hex + ' */',
  )
  return ':root[data-theme="' + theme.id + '"] {\n' + lines.join('\n') + '\n}'
}
