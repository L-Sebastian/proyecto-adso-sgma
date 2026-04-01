from django.urls import path
from . import views

urlpatterns = [
    path('farms/', views.farm_list_create, name='farm_list_create'),
    path('farms/<int:pk>/', views.farm_detail, name='farm_detail'),
    path('farms/new/', views.farm_new, name='farm_new'),
    path('products/', views.product_list_create, name='product_list_create'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
]
