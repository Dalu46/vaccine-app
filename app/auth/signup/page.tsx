import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@components/components/signup-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          VaxTrack
        </a>
        <SignupForm />
      </div>
    </div>
  )
}

// import Image from 'next/image'
// import { Card, CardContent } from "@components/components/ui/card"

// export default function BlogPost() {
//   // In a real application, you would fetch the blog post data here
//   const post = {
//     title: "The Future of Web Development: Trends to Watch in 2024",
//     image: "/placeholder.svg?height=600&width=1200",
//     content: `
//       <p>As we move further into the digital age, web development continues to evolve at a rapid pace. In 2024, we're seeing a convergence of technologies and methodologies that are reshaping how we build and interact with the web. Here are some key trends to watch:</p>

//       <h2>1. AI-Driven Development</h2>
//       <p>Artificial Intelligence is no longer just a buzzword; it's becoming an integral part of the development process. From AI-assisted coding to intelligent debugging tools, developers are leveraging machine learning to streamline their workflows and boost productivity.</p>

//       <h2>2. WebAssembly and the Rise of Browser-Based Applications</h2>
//       <p>WebAssembly (Wasm) is enabling high-performance applications to run directly in the browser. This technology is blurring the lines between web and desktop applications, opening up new possibilities for web-based software.</p>

//       <h2>3. Progressive Web Apps (PWAs) 2.0</h2>
//       <p>PWAs have been around for a while, but they're getting a major upgrade. With improved offline capabilities, better integration with native device features, and enhanced performance, PWAs are becoming indistinguishable from native apps.</p>

//       <h2>4. The Maturation of Jamstack</h2>
//       <p>Jamstack architecture continues to gain traction, offering improved performance, better security, and easier scaling. As more tools and services emerge to support this approach, we're seeing increasingly sophisticated applications built on Jamstack principles.</p>

//       <h2>5. Accessibility as a Priority</h2>
//       <p>Web accessibility is no longer an afterthought. Developers are increasingly prioritizing inclusive design from the start, ensuring that web applications are usable by people of all abilities. This shift is not just ethical; it's becoming a legal requirement in many jurisdictions.</p>

//       <p>As these trends continue to shape the landscape of web development, it's an exciting time to be in the field. The key to success will be adaptability and a commitment to continuous learning. The web of 2024 and beyond promises to be more powerful, accessible, and user-centric than ever before.</p>
//     `
//   }

//   return (
//     <article className="min-h-screen">
//       <div className="px-[1.2rem] max-w-[42rem] p-8">
//         <h1 className="text-4xl md:text-3xl lg:text-6xl font-bold text-start">
//           {post.title}
//         </h1>
//       </div>
//       <div className="relative h-[40vh] w-full mb-8">
//         <Image
//           src={post.image}
//           alt={post.title}
//           fill
//           style={{ objectFit: 'cover' }}
//           priority
//         />
//       </div>
//       <div className="px-[1.2rem] mx-auto mb-4">
//         <Card className="max-w-[42rem] mx-auto">
//           <CardContent className="prose prose-lg dark:prose-invert">
//             <div dangerouslySetInnerHTML={{ __html: post.content }} />
//           </CardContent>
//         </Card>
//       </div>
//     </article>
//   )
// }

