from django.contrib import admin
from .models import Farm, Product


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'created_at')
    search_fields = ('name', 'address')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type', 'price', 'stock', 'farm', 'active', 'created_at')
    list_filter = ('product_type', 'active', 'shipping_type')
    search_fields = ('name', 'description', 'farm__name')
    raw_id_fields = ('farm',)
