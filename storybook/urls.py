from django.urls import path

from .views import StorybookView

app_name = "storybook"

urlpatterns = [
    path("", StorybookView.as_view(), name="index"),
    path("<slug:component>/", StorybookView.as_view(), name="component"),
    path("<slug:component>/<slug:story>/", StorybookView.as_view(), name="story"),
]
