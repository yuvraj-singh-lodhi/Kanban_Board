# kanban_backend/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer

class BoardListCreateAPIView(APIView):
    def get(self, request):
        boards = Board.objects.all()
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BoardDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk)
        except Board.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND

    def get(self, request, pk):
        board = self.get_object(pk)
        serializer = BoardSerializer(board)
        return Response(serializer.data)

    def put(self, request, pk):
        board = self.get_object(pk)
        serializer = BoardSerializer(board, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        board = self.get_object(pk)
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ColumnListCreateAPIView(APIView):
    def get(self, request):
        columns = Column.objects.all()
        serializer = ColumnSerializer(columns, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ColumnSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ColumnDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Column.objects.get(pk=pk)
        except Column.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND

    def get(self, request, pk):
        column = self.get_object(pk)
        serializer = ColumnSerializer(column)
        return Response(serializer.data)

    def put(self, request, pk):
        column = self.get_object(pk)
        serializer = ColumnSerializer(column, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        column = self.get_object(pk)
        column.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TaskListCreateAPIView(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        # serializer = TaskSerializer(data=request.data)
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # response = serializer.validated_data
        # column = Column.objects.get(pk=response.get("columnId"))
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)  # Log the serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND

    def get(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
