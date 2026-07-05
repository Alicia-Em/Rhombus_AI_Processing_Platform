from django.urls import path
from .views import upload_file, job_status

urlpatterns = [
    path("upload/", upload_file),
    path("jobs/<int:job_id>/", job_status),
]