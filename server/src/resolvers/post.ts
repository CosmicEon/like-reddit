import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext,
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Query(() => [Post])
  posts(
    @Ctx() { em }: MyContext,
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: MyContext,
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext,
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null
    }

    if (title) {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }


  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext,
  ): Promise<boolean> {
    const result = await em.nativeDelete(Post, { id });
    return result > 0 ? true : false;
  }
}