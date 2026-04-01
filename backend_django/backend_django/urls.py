from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='views/index.html'), name='home'),
    path('<path:page>.html', TemplateView.as_view(), name='frontend_page'),
    path('admin/', admin.site.urls),
    path('api/', include('catalog.urls')),
]

urlpatterns += staticfiles_urlpatterns()
