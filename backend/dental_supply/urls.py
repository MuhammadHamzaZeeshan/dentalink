from django.urls import path
from . import views

urlpatterns = [
    path('api/products/', views.ProductListAPIView.as_view(), name='products'),
    path('api/listings/', views.PriceListAPIView.as_view(), name='listings'),
    path('api/orders/', views.OrderListAPIView.as_view(), name='orders'),
]