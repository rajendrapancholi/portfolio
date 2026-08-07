import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Raje",
      email: "raje@mail.com",
      password: bcrypt.hashSync("raje"),
      isAdmin: true,
    },
    {
      name: "Ak",
      email: "ak@mail.com",
      password: bcrypt.hashSync("ak"),
      isAdmin: false,
    },
  ],
  navItems: [
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Contact", link: "#contact" },
  ],

  gridItems: [
    {
      id: 1,
      title:
        "I prioritize client collaboration, Strong Analytical and Problem-Solving Skills ",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full bg-opacity-50",
      titleClassName: "justify-end",
      img: "/bg1d.jpg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: "I constantly try to improve",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },

    {
      id: 5,
      title:
        "Designing server-side rendered React applications and implementing optimized client-side rendering.",
      description: "",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Do you want to start a project together?",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ],

  projects: [
    {
      title: "Portfolio CMS & Dynamic Dashboard",
      des: "A full-stack personal brand ecosystem featuring a secure admin dashboard to manage projects and user data in real-time. Built with a dedicated backend to handle dynamic content updates without redeploying.",
      img: "/portfolio.png",
      iconLists: ["/next.svg", "/re.svg", "/ts.svg", "/tail.svg"],
      link: "/",
    },
    {
      title: "BookBary: Smart Library Management System",
      des: "BookBary is a smart library management system that simplifies book tracking, borrowing, and returns. It streamlines library operations with an intuitive interface for students, librarians, and administrators.",
      img: "/p1.jpg",
      iconLists: [
        "/re.svg",
        "/ndjs.svg",
        "/ts.svg",
        "/expjs.svg",
        "/mysql.svg",
      ],
      link: "https://rajebookbary.vercel.app/",
    },
    {
      title: "AI-powered customer support chatbot",
      des: "An AI-powered customer support chatbot that delivers instant, personalized assistance. It automates responses, resolves queries efficiently, and enhances customer satisfaction with 24/7 intelligent conversational support.",
      img: "/p2.jpg",
      iconLists: [
        "/next.svg",
        "/re.svg",
        "/tail.svg",
        "/ts.svg",
        "/py.svg",
        "/mysql.svg",
      ],
      link: "/under-deployement",
    },
    {
      title: "Server Side Selectable Grid",
      des: "A high-performance React component solving the complex problem of cross-page state persistence. Implements custom hooks for server-side pagination, handling massive datasets without UI lag",
      img: "/p3.png",
      iconLists: ["/vite.svg", "/re.svg", "/tail.svg", "/ts.svg"],
      link: "https://luminous-taffy-8c74c7.netlify.app/",
    },
  ],

  workExperience: [
    {
      id: 1,
      title: "MIS excecutive",
      desc: "Experienced MIS Executive skilled in Tally Prime data entry, cell tower electrical product management, and permission coordination. Proficient in data analysis, inventory control, and optimizing information systems for operational efficiency.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
  ],

  socialMedia: [
    {
      id: 1,
      img: "/git.svg",
    },
    {
      id: 2,
      img: "/twit.svg",
    },
    {
      id: 3,
      img: "/link.svg",
    },
  ],
};

export default data;
