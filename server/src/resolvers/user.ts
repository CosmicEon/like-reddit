import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {

  @Field(() => String)
  username: string;


  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;

}


@ObjectType()
class ObjectResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext,

  ): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => ObjectResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext,
  ): Promise<ObjectResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [{
          field: 'username',
          message: "Username must be at least 2 symbols long",

        }]
      }
    }
    if (options.password.length <= 6) {
      return {
        errors: [{
          field: 'password',
          message: "Password must be at least 6 symbols long",

        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      username: options.username,
      password: hashedPassword
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.constraint === 'user_username_unique') {
        return {
          errors: [{
            field: 'username',
            message: "Username already exists",
          }]
        }
      }
    }

    return { user };
  }

  @Mutation(() => ObjectResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<ObjectResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: "Username doesn't exist",

        }]
      }
    }

    const validatedPassword = await argon2.verify(user.password, options.password);
    if (!validatedPassword) {
      return {
        errors: [{
          field: 'password',
          message: "Incorrect Password",

        }]
      }
    }

    req.session.userId = user.id;

    return {
      user
    };
  }
}