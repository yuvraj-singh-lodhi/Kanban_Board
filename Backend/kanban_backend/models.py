from django.db import models
from django.contrib.auth.models import User  # Import Django User model

class Board(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} - User: {self.user.username}'

class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position']

    def __str__(self):
        return f'{self.title} - Board: {self.board.name}'

class Task(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    content = models.TextField()
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position']

    def __str__(self):
        return f'Task {self.id} - Column: {self.column.title}'
