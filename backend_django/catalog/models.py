from django.db import models


class Farm(models.Model):
    name = models.CharField('Nombre de finca', max_length=200)
    address = models.CharField('Dirección', max_length=300, blank=True)
    description = models.TextField('Descripción', blank=True)
    created_at = models.DateTimeField('Creado el', auto_now_add=True)

    class Meta:
        verbose_name = 'Finca'
        verbose_name_plural = 'Fincas'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    PRODUCT_TYPES = [
        ('fruta', 'Fruta'),
        ('verdura', 'Verdura'),
        ('carne', 'Carne'),
        ('fertilizante', 'Fertilizante'),
        ('otro', 'Otro'),
    ]

    SHIPPING_TYPES = [
        ('domicilio', 'Domicilio'),
        ('recoger', 'Retirar en finca'),
        ('otro', 'Otro'),
    ]

    name = models.CharField('Nombre del producto', max_length=200)
    product_type = models.CharField('Tipo', max_length=50, choices=PRODUCT_TYPES, default='fruta')
    weight = models.CharField('Peso', max_length=100, blank=True)
    unit = models.CharField('Unidad', max_length=50, blank=True)
    original_price = models.DecimalField('Precio original', max_digits=12, decimal_places=2, default=0)
    discount = models.PositiveIntegerField('Descuento (%)', default=0)
    price = models.DecimalField('Precio final', max_digits=12, decimal_places=2, default=0)
    photo_url = models.TextField('Foto', blank=True)
    farm = models.ForeignKey(Farm, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    stock = models.PositiveIntegerField('Stock', default=0)
    shipping_type = models.CharField('Tipo de envío', max_length=50, choices=SHIPPING_TYPES, default='domicilio')
    description = models.TextField('Descripción', blank=True)
    created_at = models.DateTimeField('Creado el', auto_now_add=True)
    active = models.BooleanField('Activo', default=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def farm_name(self):
        return self.farm.name if self.farm else ''
