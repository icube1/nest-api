import { Controller, Get, Param, Body, Delete, NotFoundException, Post, Patch } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Task } from './todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Get()
  async getAllTodos(): Promise<Task[]> {
    return await this.todoService.getAllTodos();
  }

  @Get(':id')
  async getTodoById(@Param('id') id: number): Promise<Task> {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  @Post()
  async createTodo(@Body() task: Task): Promise<Task> {
    return await this.todoService.createTodo(task);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number): Promise<void> {
    const deleted = await this.todoService.deleteTodo(id);
    if (!deleted) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  @Patch(':id')
  async updateTodo(@Param('id') id: number, @Body() task: Task): Promise<Task> {
    const updatedTodo = await this.todoService.updateTodo(id, task);
    if (!updatedTodo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return updatedTodo;
  }
}
