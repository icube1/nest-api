// article.controller.ts
import { Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { PermissionGuard } from '../role/guards/permission.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.articleService.findAll(page, limit);
  }

  @Get(':id')
  findOne(id: number) {
    return this.articleService.findOne(id);
  }
  @Post()
  @UseGuards(PermissionGuard)
  async create(@Query('userId') userId: string, @Query('articleData') data: any) {
    return await this.articleService.createArticle(data, userId)
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  update(@Query('userId') userId: string, @Query('articleData') data: any) {
    return this.articleService.createArticle(data, userId);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(id: number, @Query('userId') userId: string) {
    return this.articleService.deleteArticle(id, userId)
  }
}