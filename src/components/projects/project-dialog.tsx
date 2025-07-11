
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';
import { Textarea } from '../ui/textarea';

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Название должно быть не менее 3 символов.' }),
  description: z.string().min(10, { message: 'Описание должно быть не менее 10 символов.' }),
  status: z.enum(['Активен', 'В ожидании', 'Завершен']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project | null;
  mode: 'create' | 'edit';
};

export function ProjectDialog({ isOpen, onClose, onSave, project, mode }: ProjectDialogProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Активен',
    },
  });

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && project) {
      form.reset(project);
    } else if (isOpen && mode === 'create') {
      form.reset({
        name: '',
        description: '',
        status: 'Активен',
      });
    }
  }, [isOpen, mode, project, form]);

  const onSubmit = (data: ProjectFormValues) => {
    onSave(data as Project);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Создать новый проект' : 'Редактировать проект'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Заполните информацию о новом проекте.'
              : `Вы редактируете проект "${project?.name}".`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название проекта</FormLabel>
                  <FormControl>
                    <Input placeholder="Название проекта" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Краткое описание проекта" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус проекта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Активен">Активен</SelectItem>
                      <SelectItem value="В ожидании">В ожидании</SelectItem>
                      <SelectItem value="Завершен">Завершен</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Отмена
                    </Button>
                </DialogClose>
                <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
