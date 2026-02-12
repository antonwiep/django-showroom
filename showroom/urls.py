from django.urls import path

from .views import ShowroomView

app_name = "showroom"

urlpatterns = [
    path("", ShowroomView.as_view(), name="index"),
    path("<slug:component>/", ShowroomView.as_view(), name="component"),
    path("<slug:component>/<slug:story>/", ShowroomView.as_view(), name="story"),
]
