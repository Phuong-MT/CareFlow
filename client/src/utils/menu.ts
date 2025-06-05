import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
export const  MenuSidebar = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Event",
      url: "/admin/events",
      icon: BookOpen,
      isActive: true,
      items: [
        {
           title: "Event List",
          url: "/",
        },
        {
          title: "Create Event",
          url: "/create",
        },
        {
          title: "Create Location",
          url: "/Location_create",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Poc-assignment",
      url: "/admin/poc-assignment",
      icon: Bot,
    },
    {
      name: "Analytics ",
      url: "/admin/analys",
      icon: Bot,
    },
    {
      name: "Account",
      url: "/admin/account",
      icon: Map,
    },
  ],
}
export const MenuSidebarPoc = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ], 
  navMain: [
    {
      title: "Playground",
      url: "/poc",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Event-detail",
          url: "/event",
        },
        {
          title: "Profile",
          url: "/account",
        },
        {
          title: "Settings",
          url: "/setting",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
  ],
}

export const MenuSidebarUser = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Event",
      url: "/user/events",
      icon: BookOpen,
      isActive: true,
      items: [
        {
           title: "Event List",
          url: "/",
        },
      ]
    },
  ],
  projects: [
    {
      name: "Profile",
      url: "/user/profile",
      icon: Bot,
    },
  ],
}
