import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreatePostDto } from "src/post/dto";
import { EditPostDto } from "src/post/dto/edit-post.dto";
import * as argon from 'argon2';

describe("App e2e", ()=> {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333');

    const edvard = await prisma.user.create({ data: { 
      email: 'edvardAdmin@gmail.com',
      hash: await argon.hash('edvardAdmin'),
      firstName: 'Edvard',
      lastName: 'Solomon',
      role: 'admin',
     } })
  
    const aliona = await prisma.user.create({ data: { 
      email: 'alionaUser@gmail.com',
      hash: await argon.hash('alionaUser'),
      firstName: 'Aliona',
      lastName: 'Solomonova',
      role: 'user',
     } })
  
    const post1 = await prisma.post.create({
      data: {
      
          title: 'this is edvards post =)',
          content: 'testing post writted by edvard',
          link: 'https://www.youtube.com/',
      
          userId: edvard.id
      },
    })
  
    const post2 = await prisma.post.create({
      data: {
      
          title: 'this is Alionas post =)',
          content: 'testing post writted by aliona',
          link: 'https://www.youtube.com/',
      
          userId: aliona.id
      },
    })


  });

  afterAll( async () => {
    await prisma.cleanDB();
    app.close();
  });

  const newUser: AuthDto = {
    email: 'edvardsolomon@gmail.com',
    password: '123345',
  }

  const admin: AuthDto = {
    email: 'edvardAdmin@gmail.com',
    password: 'edvardAdmin',
  }

  const oldUser: AuthDto = {
    email: 'alionaUser@gmail.com',
    password: 'alionaUser',
  }

  
  describe('Auth', () => {
    describe('Signup', () => {

      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({
          password: newUser.password,
          email: '',
        })
        .expectStatus(400);
      })

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({
          password: '',
          email: newUser.email,
        })
        .expectStatus(400);
      })

      it('should throw if no body provided', () => {
        return pactum.spec()
        .post('/auth/signup')
        .expectStatus(400);
      })

      it('should signup', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody(newUser)
        .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should signin recently registered user', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(newUser)
        .expectStatus(200)
        .stores('newUserAt', 'access_token');
      });

      it('should signin admin', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(admin)
        .expectStatus(200)
        .stores('adminAt', 'access_token');
      });

      it('should signin old user', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(oldUser)
        .expectStatus(200)
        .stores('oldUserAt', 'access_token');
      });

      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/signin')
        .withBody({
          password: newUser.password,
          email: '',
        })
        .expectStatus(400);
      })

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/sigin')
        .withBody({
          email: newUser.email,
        })
        .expectStatus(404);
      })

      it('should throw if no body provided', () => {
        return pactum.spec()
        .post('/auth/signin')
        .expectStatus(400);
      })
    });
  });

  describe('User', () => {
    describe('Get me', () => {

      it('should get current user(new user)', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(200)
      })

      it('should get current user(admin)', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .expectStatus(200)
      })

      it('should get current user(old user)', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{oldUserAt}',
        })
        .expectStatus(200)
        .stores('alionaId', 'id');
      })

      it('should throw if no jwt provided', () => {
        return pactum
        .spec()
        .get('/users/me')
        .expectStatus(401)
      })

    });

    describe('Get user by id', () => {

      it('should get by id', () => {
        return pactum
        .spec()
        .get('/users/{id}')
        .withPathParams('id', '$S{alionaId}')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(200)
      })

    });

    describe('Edit user', () => {

      it('should edit current user', () => {

        const dto: EditUserDto = {
          firstName: "ChangedName",
          email: 'change@gmail.com',
        };

        return pactum
        .spec()
        .patch('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
      })

      it('should edit another user by admin', () => {

        const dto: EditUserDto = {
          firstName: "ChangedAlionaName",
        };

        return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{alionaId}')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
      })

      it('should throw when not admin try to edit another user', () => {

        const dto: EditUserDto = {
          firstName: "AnotherChangedAlionaName",
        };

        return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{alionaId}')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .withBody(dto)
        .expectStatus(403)
      })

    });
  });

  describe('Posts', () => {

    describe('Create post', () => {
      
      const dto: CreatePostDto = {
        title: "First Post",
        content: "Link to youtube =)",
        link: "https://www.youtube.com/",
      };

      it('should create post', () => {
        return pactum
        .spec()
        .post('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .withBody(dto)
        .expectStatus(201)
        .stores('newUsersPostId', 'id');
      })

    });

    describe('Get posts', () => {

      it('should get all posts', () => {
        return pactum
        .spec()
        .get('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(200)
      })

      it('should get all posts by authorId', () => {
        return pactum
        .spec()
        .get('/posts/author/{id}')
        .withPathParams('id', '$S{alionaId}')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(200)
        .stores('oldUsersPostId', '[0].id');
      })

      
    });

    describe('Get post by id', () => {

      it('should get post by id', () => {
        return pactum
        .spec()
        .get('/posts/{id}')
        .withPathParams('id', '$S{newUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{newUsersPostId}');
      })

    });

    describe('Edit post', () => {
      const editPost1: EditPostDto = {
        title: "Node JS - test task edit by author",
        content: "Create RESTful / GraphQL API for management of users and their posts",
      }

      const editPost2: EditPostDto = {
        title: "Admin changed it",
        content: "Admin changed it",
      }

      const editPost3: EditPostDto = {
        title: "Another user changed it",
        content: "Another user changed it",
      }

      it('should edit post by author', () => {
        return pactum
        .spec()
        .patch('/posts/{id}')
        .withPathParams('id', '$S{oldUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{oldUserAt}',
        })
        .withBody(editPost1)
        .expectStatus(200);
      })

      
      it('should edit post by admin', () => {
        return pactum
        .spec()
        .patch('/posts/{id}')
        .withPathParams('id', '$S{oldUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .withBody(editPost2)
        .expectStatus(200);
      })

      it('should throw when user try to edit another users post', () => {
        return pactum
        .spec()
        .patch('/posts/{id}')
        .withPathParams('id', '$S{newUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{oldUserAt}',
        })
        .withBody(editPost3)
        .expectStatus(403);
      })

      it('should throw when postId is incorrect', () => {
        return pactum
        .spec()
        .patch('/posts/9999')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .withBody(editPost3)
        .expectStatus(403);
      })

    });

    describe('Delete post', () => {

      it('should throw when user try to delete another users post', () => {
        return pactum
        .spec()
        .delete('/posts/{id}')
        .withPathParams('id', '$S{newUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{oldUserAt}',
        })
        .expectStatus(403);
      })

      it('should delete post by admin', () => {
        return pactum
        .spec()
        .delete('/posts/{id}')
        .withPathParams('id', '$S{oldUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .expectStatus(204);
      })


      it('should delete post by author', () => {
        return pactum
        .spec()
        .delete('/posts/{id}')
        .withPathParams('id', '$S{newUsersPostId}')
        .withHeaders({
          Authorization: 'Bearer $S{newUserAt}',
        })
        .expectStatus(204);
      })

    });
  });

  describe('Delete user', () => {

    it('should throw when not admin try to delete another user', () => {

      return pactum
      .spec()
      .delete('/users/{id}')
      .withPathParams('id', '$S{alionaId}')
      .withHeaders({
        Authorization: 'Bearer $S{newUserAt}',
      })
      .expectStatus(403)
    })

    it('should delete another user by admin', () => {

      return pactum
      .spec()
      .delete('/users/{id}')
      .withPathParams('id', '$S{alionaId}')
      .withHeaders({
        Authorization: 'Bearer $S{adminAt}',
      })
      .expectStatus(204)
    })

    it('should delete current user(new user)', () => {
      return pactum
      .spec()
      .delete('/users/me')
      .withHeaders({
        Authorization: 'Bearer $S{newUserAt}',
      })
      .expectStatus(204)
    })
  }); 
});
