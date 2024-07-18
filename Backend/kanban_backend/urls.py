from django.urls import path
from . import views
from .views import UserCreateAPIView, UserLoginAPIView

urlpatterns = [
    path('api/signup/', UserCreateAPIView.as_view(), name='user-signup'),
    path('api/login/', UserLoginAPIView.as_view(), name='user-login'),
    path('api/boards/', views.BoardListCreateAPIView.as_view(), name='board-list-create'),
    path('api/boards/<int:pk>/', views.BoardRetrieveUpdateDestroyAPIView.as_view(), name='board-detail'),
    path('api/columns/', views.ColumnListCreateAPIView.as_view(), name='column-list-create'),
    path('api/columns/<int:pk>/', views.ColumnRetrieveUpdateDestroyAPIView.as_view(), name='column-detail'),
    path('api/tasks/', views.TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('api/tasks/<int:pk>/', views.TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-detail'),
]
