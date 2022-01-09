import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: TaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let taskResult = this.getAllTasks();
  //   if (status) {
  //     taskResult = taskResult.filter((item) => item.status === status);
  //   }
  //   if (search) {
  //     taskResult = taskResult.filter((item) => {
  //       if (item.title.includes(search) || item.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return taskResult;
  // }

  //fetch all task list
  async getTaskList(): Promise<Task[]> {
    const list = await this.taskRepository.find({});
    return list;
  }

  //get task by id
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return found;
  }

  //create a new task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
    // const { title, description } = createTaskDto;
    // const taskObj = this.taskRepository.create({
    //   title,
    //   description,
    //   status: TaskStatus.OPEN,
    // });

    // await this.taskRepository.save(taskObj);
    // return taskObj;
  }

  //delete the task from the db
  async deleteTask(id: string): Promise<any> {
    const removedRes = await this.taskRepository.delete(id);
    console.log(removedRes);
    if (removedRes.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return { success: true, message: 'Task removed successfully.' };
  }

  //update the status of the task
  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const result = await this.getTaskById(id);
    result.status = status;
    await this.taskRepository.save(result);
    return result;
  }
}
