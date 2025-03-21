import { notFound } from "next/navigation";
import { blogPosts } from "../../data/blogPost";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/components/ui/avatar";
import { Badge } from "../../../components/components/ui/badge";

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4 sm:px-6">
      {/* Cover Image */}
      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
        <img
          src={post.author.imageUrl || "/placeholder.svg?height=800&width=1200"}
          alt={post.title}
          // fill
          // priority
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-8">
        <div>
          <Link href={post.category.href}>
            <Badge variant="secondary" className="mb-4">
              {post.category.title}
            </Badge>
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">{post.title}</h1>

          <p className="text-xl text-muted-foreground">{post.excerpt || post.description}</p>
        </div>

        <div className="flex items-center gap-x-4 border-y border-gray-200 py-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Link href={post.author.href} className="font-semibold text-gray-900 hover:underline">
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-600">{post.author.role}</p>
          </div>

          <time dateTime={post.datetime} className="text-gray-500 flex items-center text-sm">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {post.date}
          </time>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed">{post.description}</p>
          <div className="mt-6">
            {post.content ? (
              // <p>{post.content}</p>
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
            ) : (
              <>
                <p>
                  Vaccinations are a critical tool in preventing the spread of infectious diseases. They work by
                  training your immune system to recognize and fight off harmful pathogens, protecting you and the
                  community.
                </p>
                <p>
                  The concept of vaccination dates back centuries, with the first documented use occurring in the late
                  18th century when Edward Jenner developed a method to protect against smallpox. Since then, vaccines
                  have been developed for numerous diseases, saving millions of lives worldwide.
                </p>
                <p>
                  Modern vaccines undergo rigorous testing to ensure their safety and efficacy. The benefits of
                  vaccination extend beyond individual protection, contributing to what's known as "herd immunity." This
                  occurs when a significant portion of a population becomes immune to a disease, making its spread from
                  person to person unlikely.
                </p>
                <p>
                  Despite the overwhelming scientific evidence supporting the safety and effectiveness of vaccines,
                  misinformation continues to circulate. It's important to consult reliable sources and healthcare
                  professionals when making decisions about vaccination.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Link href="/blog" className="text-primary hover:underline">
            ← Back to all posts
          </Link>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">By {post.author.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

