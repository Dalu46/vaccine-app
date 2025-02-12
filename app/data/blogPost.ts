export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  href: string;
  description?: string; // Optional property
  date: string;
  datetime: string;
  category: {
    title: string;
    href: string;
  };
  author: {
    name: string;
    role: string;
    href: string;
    imageUrl: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Boost your conversion rate",
    excerpt:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide.",
    content:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide. The spread of misinformation through social media and other digital platforms has contributed to this problem. Addressing vaccine hesitancy requires a multifaceted approach, including clear communication of scientific evidence, addressing concerns and misconceptions, and building trust between healthcare providers and communities. Public health organizations are increasingly using digital strategies to combat misinformation and promote vaccine confidence.",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: "2",
    title: "Boost your conversion rate",
    excerpt:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide.",
    content:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide. The spread of misinformation through social media and other digital platforms has contributed to this problem. Addressing vaccine hesitancy requires a multifaceted approach, including clear communication of scientific evidence, addressing concerns and misconceptions, and building trust between healthcare providers and communities. Public health organizations are increasingly using digital strategies to combat misinformation and promote vaccine confidence.",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: "3",
    title: "Boost your conversion rate",
    excerpt:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide.",
    content:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide. The spread of misinformation through social media and other digital platforms has contributed to this problem. Addressing vaccine hesitancy requires a multifaceted approach, including clear communication of scientific evidence, addressing concerns and misconceptions, and building trust between healthcare providers and communities. Public health organizations are increasingly using digital strategies to combat misinformation and promote vaccine confidence.",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: "4",
    title: "Boost your conversion rate",
    excerpt:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide.",
    content:
      "Despite the proven benefits of vaccines, vaccine hesitancy remains a significant challenge to public health efforts worldwide. The spread of misinformation through social media and other digital platforms has contributed to this problem. Addressing vaccine hesitancy requires a multifaceted approach, including clear communication of scientific evidence, addressing concerns and misconceptions, and building trust between healthcare providers and communities. Public health organizations are increasingly using digital strategies to combat misinformation and promote vaccine confidence.",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];
