# kanban_backend/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        data['position'] = Column.objects.filter(board_id=data['board']).count()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        data['position'] = instance.position
        return super().update(request, *args, **kwargs)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        data['position'] = Task.objects.filter(column_id=data['column']).count()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        data['position'] = instance.position
        return super().update(request, *args, **kwargs)
