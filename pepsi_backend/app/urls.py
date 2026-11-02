from django.urls import path, register_converter
from . import views


class OrderIdConverter:
    regex = r"pepsi-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value


register_converter(OrderIdConverter, "order_id")

urlpatterns = [
    path("health", views.HealthView.as_view()),
    path("videos", views.CreateVideoView.as_view()),
    path("videos/<order_id:order_id>", views.VideoStatusView.as_view()),
    path("videos/<order_id:order_id>/download", views.DownloadVideoView.as_view()),
]