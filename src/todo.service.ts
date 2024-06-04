import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async getAllTodos(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTodoById(id: number): Promise<Task> {
    const todo = await this.taskRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return todo;
  }

  async createTodo(taskData: Partial<Task>): Promise<Task> {
    const newTodo = this.taskRepository.create(taskData);
    return await this.taskRepository.save(newTodo);
  }

  async deleteTodo(id: number): Promise<Task> {
    const todoToDelete = await this.taskRepository.findOne({ where: { id } });
    if (!todoToDelete) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    const deletedTodo = await this.taskRepository.remove(todoToDelete);
    return deletedTodo;
  }

  async updateTodo(id: number, taskData: Partial<Task>): Promise<Task> {
    try {
      const todoToUpdate = await this.taskRepository.findOne({ where: { id } });

      if (!todoToUpdate) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }

      Object.assign(todoToUpdate, taskData);
      await this.taskRepository.save(todoToUpdate);
      const todoUpdated = await this.taskRepository.findOne({ where: { id } });
      return todoUpdated;
    } catch (error) {
      throw new Error(`Unable to update todo with id ${id}`);
    }
  }
}