import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    // private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await this.articleRepository.find({
      skip,
      take: limit,
    });
  }

  async findAllByUserId(id: string) {
    const articles = await this.articleRepository.find({
      where: {
        author: id,
      },
    });

    if (!articles.length) {
      throw new NotFoundException(`This user doesn't have any articles yet`);
    }

    return articles;
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({where: {id}});

    if (!article) {
      throw new NotFoundException(`Article under this id doesn't exist`);
    }

    return article;
  }

  async createArticle(articleData: Partial<Article>, userId: string) {
    // Check if the user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Assign the author based on the user creating the article
    articleData.authorId = userId;
    articleData.author = user.name;

    const newArticle = this.articleRepository.create(articleData);
    await this.articleRepository.save(newArticle);

    return newArticle;
  }

  async updateArticle(id: number, articleData: Partial<Article>, userId: string) {
    const article = await this.articleRepository.findOne({where: {id}});

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    // Check if the user is the author of the article
    if (article.authorId !== userId) {
      throw new UnauthorizedException(`You are not authorized to update this article`);
    }

    this.articleRepository.merge(article, articleData);
    await this.articleRepository.save(article);

    return article;
  }

  async deleteArticle(id: number, userId: string) {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    // Check if the user is the author of the article
    if (article.authorId !== userId) {
      throw new UnauthorizedException(`You are not authorized to delete this article`);
    }

    await this.articleRepository.delete(id);

    return article;
  }

}
