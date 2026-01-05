import { ResumeData } from "@/types/resume";

const resumeData: ResumeData = {
  name: "Zain Atif",
  contact: {
    email: "zainatif15403@gmail.com",
    phone: "+92 3148501486",
    location: "Gujrat, Pakistan"
  },
  sections: [
    {
      id: "summary",
      title: "SUMMARY",
      items: [
        {
          paragraph: "I am a Front-End Developer with 2+ years of experience building clean, responsive, and user-friendly web interfaces. Specializing in TypeScript, HTML5, CSS3, and Tailwind CSS with expertise in Next.js development. I have focused on creating high-performance, accessible web applications with modern UI/UX principles."
        }
      ]
    },
    {
      id: "experience",
      title: "WORK EXPERIENCE",
      items: [
        {
          boldLeft: "Skyline Digital Ltd.",
          boldRight: "03/2024 – Present",
          italicLeft: "Front-End Developer, London, UK",
          italicRight: "",
          paragraph: "",
          bullets: [
            "Lead front-end development for UK-based fintech platform using Next.js 14 and TypeScript",
            "Architected and implemented scalable design system with Tailwind CSS and Storybook, reducing UI bugs by 40%",
            "Collaborated with cross-functional teams in Agile environment to deliver features for European market compliance",
            "Optimized application performance achieving 95+ Lighthouse scores for core web vitals"
          ]
        },
        {
          boldLeft: "TechNova Solutions Inc.",
          boldRight: "08/2023 – 02/2024",
          italicLeft: "Front-End Developer, San Francisco, CA",
          italicRight: "",
          paragraph: "",
          bullets: [
            "Developed and maintained responsive web applications using Next.js and TypeScript for US-based SaaS platform",
            "Implemented custom UI components with Tailwind CSS, improving development efficiency by 30%",
            "Implemented automated testing and CI/CD pipelines using GitHub Actions for seamless deployments"
          ]
        }
      ]
    },
    {
      id: "projects",
      title: "PROJECTS",
      items: [
        {
          boldLeft: "FinDash Analytics Platform",
          boldRight: "Personal Project",
          italicLeft: "Next.js 14 • TypeScript • Tailwind CSS • Recharts",
          italicRight: "",
          paragraph: "",
          bullets: [
            "Built a comprehensive financial dashboard for visualizing real-time market data and portfolio analytics",
            "Implemented server-side rendering for optimal SEO and initial load performance",
            "Created interactive data visualizations using Recharts with real-time WebSocket updates",
            "Achieved perfect Lighthouse score (100) for performance, accessibility, and best practices"
          ]
        },
        {
          boldLeft: "EcoTrack Sustainability App",
          boldRight: "Open Source Project",
          italicLeft: "React • TypeScript • Firebase • Material-UI",
          italicRight: "",
          paragraph: "",
          bullets: [
            "Developed a carbon footprint tracking application with gamification elements to encourage sustainable habits",
            "Integrated Firebase for real-time data synchronization and user authentication",
            "Designed responsive mobile-first UI with dark/light mode toggle",
            "Featured in GitHub's trending repositories for 2 weeks with 150+ stars"
          ]
        },
        {
          boldLeft: "DevConnect Developer Portfolio Platform",
          boldRight: "Freelance Project",
          italicLeft: "Next.js • Tailwind CSS • Vercel • GitHub API",
          italicRight: "",
          paragraph: "",
          bullets: [
            "Created a customizable portfolio platform for developers with GitHub integration",
            "Implemented automated project showcase pulling live data from GitHub repositories",
            "Built custom CMS-like functionality for content management without backend",
            "Deployed on Vercel Edge Network for global performance optimization"
          ]
        }
      ]
    },
    {
      id: "education",
      title: "EDUCATION",
      items: [
         {
          boldLeft: "University of Gujrat, Gujrat",
          boldRight: "06/2023",
          italicLeft: "",
          italicRight: "",
          paragraph: "BS (Software Engineering)",
          bullets: []
        },
        {
          boldLeft: "FDC Faisal, Karachi",
          boldRight: "07/2019",
          italicLeft: "",
          italicRight: "",
          paragraph: "HSSC (Computer Science)",
          bullets: []
        }
      ]
    },
    {
      id: "others",
      title: "OTHERS",
      items: [
        {
          paragraph: "",
          bullets: [
            "**Technical Skills:** TypeScript/JavaScript, HTML5, CSS3/Tailwind CSS, Next.js, React.js, Storybook, Vercel, Git & GitHub, REST APIs, WebSocket, Firebase, Recharts, Material-UI",
            "**Certifications:** Next.js 14 Certification (Vercel), Advanced TypeScript (Frontend Masters)",
            "**Languages:** English (Professional Proficiency C1), Urdu (Native C2)"
          ]
        }
      ]
    }
  ],
  copyright: "© 2025 Zain Atif. All rights reserved."
};

export default resumeData;
