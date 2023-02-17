import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreatePostDto } from "src/post/dto";
import { EditPostDto } from "src/post/dto/edit-post.dto";

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
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  const dto: AuthDto = {
    email: 'edvardsolomon@gmail.com',
    password: '123345',
  }
  
  describe('Auth', () => {
    describe('Signup', () => {

      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({
          password: dto.password,
          email: '',
        })
        .expectStatus(400);
      })

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({
          password: '',
          email: dto.email,
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
        .withBody(dto)
        .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should signin', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token');
      });

      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/signin')
        .withBody({
          password: dto.password,
          email: '',
        })
        .expectStatus(400);
      })

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/sigin')
        .withBody({
          email: dto.email,
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

      it('should ger current user', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
      })

    });

    describe('Edit user', () => {

      it('should edit user', () => {

        const dto: EditUserDto = {
          firstName: "Max",
          email: 'Max@gmail.com',
        };

        return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
      })

    });
  });

  describe('Posts', () => {
    describe('Get empty posts', () => {

      it('should get posts', () => {
        return pactum
        .spec()
        .get('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBody([]);
      })

    });

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
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(201)
        .stores('postId', 'id');
      })

    });

    describe('Get posts', () => {

      it('should get posts', () => {
        return pactum
        .spec()
        .get('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
      })

    });

    describe('Get post by id', () => {

      it('should get post by id', () => {
        return pactum
        .spec()
        .get('/posts/{id}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{postId}');
      })

    });

    describe('Edit post', () => {
      const dto: EditPostDto = {
        title: "Node JS - test task",
        content: "Create RESTful / GraphQL API for management of users and their posts",
      }

      it('should edit post', () => {
        return pactum
        .spec()
        .patch('/posts/{id}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200);
      })

    });

    describe('Delete bookmark', () => {

      it('should delete post', () => {
        return pactum
        .spec()
        .delete('/posts/{id}')
        .withPathParams('id', '$S{postId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(204);
      })

      it('should get empty posts', () => {
        return pactum
        .spec()
        .get('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectJsonLength(0);
      })

    });
  });

});