import { notFound } from "next/navigation";
import { blogPosts } from '../../data/blogPost'
// import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/components/ui/avatar"
import { Badge } from "../../../components/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/components/ui/card"

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
    <CardHeader>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
          <p className="text-xl text-muted-foreground mt-2">{post.excerpt}</p>
        </div>
        <Link href={post.category.href}>
          <Badge variant="secondary" className="text-sm">
            {post.category.title}
          </Badge>
        </Link>
      </div>
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={post.datetime} className="text-gray-500 flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {post.date}
        </time>
        <Link href={post.author.href} className="flex items-center gap-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-gray-900">{post.author.name}</span>
          <span className="text-gray-600">({post.author.role})</span>
        </Link>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-lg text-muted-foreground mb-4">{post.description}</p>
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <div className="text-sm text-blue-600 hover:underline">
        vaccine blog
      </div>
      <div className="flex items-center space-x-2">
        <UserIcon className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">By {post.author.name}</span>
      </div>
    </CardFooter>
  </Card>
  );
}


