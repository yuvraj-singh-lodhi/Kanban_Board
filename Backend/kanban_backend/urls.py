# kanban_backend/urls.py
from django.urls import path
from .views import (
    BoardListCreateAPIView, BoardDetailAPIView,
    ColumnListCreateAPIView, ColumnDetailAPIView,
    TaskListCreateAPIView, TaskDetailAPIView,
)

urlpatterns = [
    path('boards/', BoardListCreateAPIView.as_view(), name='board-list'),
    path('boards/<int:pk>/', BoardDetailAPIView.as_view(), name='board-detail'),
    path('columns/', ColumnListCreateAPIView.as_view(), name='column-list'),
    path('columns/<int:pk>/', ColumnDetailAPIView.as_view(), name='column-detail'),
    path('tasks/', TaskListCreateAPIView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailAPIView.as_view(), name='task-detail'),
]
