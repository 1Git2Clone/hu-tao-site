import { type History } from '$lib/types/history_tree';

export const linux_and_dotfiles_history_tree: History[] = [
  {
    year: 2023,
    months: [
      {
        name: "September",
        tasks: [`
Started using Linux Mint as my main OS.

Back then I was using Cinnamon for around a month and KDE for 2-3 months.
`.trim()
        ]
      },
      {
        name: "December",
        tasks: [`
Moved onto Arch Linux. (of course)
`.trim()
        ]
      },
    ]
  },
  {
    year: 2024,
    months: [
      {
        name: "January",
        tasks: [`
Started my [dotfiles](https://github.com/1Git2Clone/dotfiles/commit/1c63df89406141cbd55e00a6bf6eebbf2a105f17) repo. 🥹🥹🥹

> **Note**: At first I started with Hyprland but it didn't last long...
>
> Also, shout outs to
> [soldoestech/hyprv4](https://github.com/soldoestech/hyprv4) for the first
> Hyprland config I used.
`.trim()
        ]
      },
      {
        name: "April",
        tasks: [`
[27851b3](https://github.com/1Git2Clone/dotfiles/commit/27851b3c42bd2030e3d52dde1a06b8971cc9ca03)
-> Moved from Hyprland to i3.
`.trim()
        ]
      },
    ]
  },
  {
    year: 2025,
    months: [
      {
        name: "April",
        tasks: [`
[8cf4d60](https://github.com/1Git2Clone/dotfiles/commit/8cf4d6027f3a088f736aca764080a2951b1c4d15)
-> Purchased a laptop and used Hyprland on it. Eventually this became a private
repo and my main dotfiles for almost a year cause I had work things in my
dotfiles and didn't have time to clean up everything with
[filter-repo](https://github.com/newren/git-filter-repo).

_And yes, I could've nuked all my commits but it was thanks to these same
commits that I was able to give a timeline of my Linux dotfiles journey so I'm
glad I didn't._
`.trim()
        ]
      },
    ]
  },
  {
    year: 2026,
    months: [
      {
        name: "March",
        tasks: [`
[0f303d9](https://github.com/1Git2Clone/dotfiles/commit/0f303d9bdaa98cb7cc9c64fbc7c43f3b68cfa761)
-> cleaned up everything with
[filter-repo](https://github.com/newren/git-filter-repo) and updated the
\`README.md\` showcase.

[0348305](https://github.com/1Git2Clone/dotfiles/commit/0348305743a7cf4d5b3be59ecb42cd487d422b33)
-> Also moved the Neovim config into a
[separate repo](https://github.com/1Git2Clone/nvim-config)
`.trim()
        ]
      },
    ]
  },
] as const satisfies History[];
