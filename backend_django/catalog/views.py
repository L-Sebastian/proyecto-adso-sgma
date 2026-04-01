import json
from decimal import Decimal

from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Farm, Product


def serialize_farm(farm):
    return {
        'id': farm.id,
        'name': farm.name,
        'address': farm.address,
        'description': farm.description,
        'created_at': farm.created_at.isoformat(),
    }


def serialize_product(product):
    return {
        'id': product.id,
        'name': product.name,
        'product_type': product.product_type,
        'weight': product.weight,
        'unit': product.unit,
        'original_price': float(product.original_price),
        'discount': product.discount,
        'price': float(product.price),
        'photo_url': product.photo_url,
        'farm_id': product.farm.id if product.farm else None,
        'farm_name': product.farm.name if product.farm else None,
        'stock': product.stock,
        'shipping_type': product.shipping_type,
        'description': product.description,
        'created_at': product.created_at.isoformat(),
        'active': product.active,
    }


def parse_json_body(request):
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return None


@require_http_methods(['GET', 'POST'])
@csrf_exempt
def farm_list_create(request):
    if request.method == 'GET':
        farms = Farm.objects.all()
        return JsonResponse([serialize_farm(farm) for farm in farms], safe=False)

    data = parse_json_body(request)
    if data is None:
        return HttpResponseBadRequest('JSON inválido')

    farm = Farm.objects.create(
        name=data.get('name', '').strip(),
        address=data.get('address', '').strip(),
        description=data.get('description', '').strip(),
    )
    return JsonResponse(serialize_farm(farm), status=201)


@require_http_methods(['GET', 'PUT', 'PATCH', 'DELETE'])
@csrf_exempt
def farm_detail(request, pk):
    farm = get_object_or_404(Farm, pk=pk)

    if request.method == 'GET':
        return JsonResponse(serialize_farm(farm))

    if request.method in ('PUT', 'PATCH'):
        data = parse_json_body(request)
        if data is None:
            return HttpResponseBadRequest('JSON inválido')

        farm.name = data.get('name', farm.name).strip() or farm.name
        farm.address = data.get('address', farm.address).strip()
        farm.description = data.get('description', farm.description).strip()
        farm.save()
        return JsonResponse(serialize_farm(farm))

    if request.method == 'DELETE':
        farm.delete()
        return HttpResponse(status=204)


@require_http_methods(['GET', 'POST'])
@csrf_exempt
def product_list_create(request):
    if request.method == 'GET':
        products = Product.objects.select_related('farm').all()
        return JsonResponse([serialize_product(product) for product in products], safe=False)

    data = parse_json_body(request)
    if data is None:
        return HttpResponseBadRequest('JSON inválido')

    farm = None
    farm_id = data.get('farm_id')
    if farm_id:
        farm = Farm.objects.filter(pk=farm_id).first()
    elif data.get('farm_name'):
        farm, _ = Farm.objects.get_or_create(
            name=data.get('farm_name').strip(),
            defaults={
                'address': data.get('farm_address', '').strip(),
                'description': data.get('farm_description', '').strip(),
            }
        )

    product = Product.objects.create(
        name=data.get('name', '').strip(),
        product_type=data.get('product_type', 'fruta'),
        weight=data.get('weight', '').strip(),
        unit=data.get('unit', '').strip(),
        original_price=Decimal(str(data.get('original_price', 0))) if data.get('original_price') is not None else Decimal('0'),
        discount=int(data.get('discount', 0) or 0),
        price=Decimal(str(data.get('price', 0))) if data.get('price') is not None else Decimal('0'),
        photo_url=data.get('photo_url', '').strip(),
        farm=farm,
        stock=int(data.get('stock', 0) or 0),
        shipping_type=data.get('shipping_type', 'domicilio'),
        description=data.get('description', '').strip(),
        active=bool(data.get('active', True)),
    )
    return JsonResponse(serialize_product(product), status=201)


@require_http_methods(['GET', 'PUT', 'PATCH', 'DELETE'])
@csrf_exempt
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == 'GET':
        return JsonResponse(serialize_product(product))

    if request.method in ('PUT', 'PATCH'):
        data = parse_json_body(request)
        if data is None:
            return HttpResponseBadRequest('JSON inválido')

        if 'name' in data:
            product.name = data.get('name', product.name).strip() or product.name
        if 'product_type' in data:
            product.product_type = data.get('product_type', product.product_type)
        if 'weight' in data:
            product.weight = data.get('weight', product.weight).strip()
        if 'unit' in data:
            product.unit = data.get('unit', product.unit).strip()
        if 'original_price' in data:
            product.original_price = Decimal(str(data.get('original_price', product.original_price)))
        if 'discount' in data:
            product.discount = int(data.get('discount', product.discount) or 0)
        if 'price' in data:
            product.price = Decimal(str(data.get('price', product.price)))
        if 'photo_url' in data:
            product.photo_url = data.get('photo_url', product.photo_url).strip()
        if 'stock' in data:
            product.stock = int(data.get('stock', product.stock) or 0)
        if 'shipping_type' in data:
            product.shipping_type = data.get('shipping_type', product.shipping_type)
        if 'description' in data:
            product.description = data.get('description', product.description).strip()
        if 'active' in data:
            product.active = bool(data.get('active'))

        farm_id = data.get('farm_id')
        if farm_id is not None:
            product.farm = Farm.objects.filter(pk=farm_id).first()
        elif data.get('farm_name'):
            farm, _ = Farm.objects.get_or_create(
                name=data.get('farm_name').strip(),
                defaults={
                    'address': data.get('farm_address', '').strip(),
                    'description': data.get('farm_description', '').strip(),
                }
            )
            product.farm = farm

        product.save()
        return JsonResponse(serialize_product(product))

    if request.method == 'DELETE':
        product.delete()
        return HttpResponse(status=204)

def farm_new(request):
    return render(request, 'views_farm_new.html')