from django.urls import path
from .views import UploadFileView, job_status

urlpatterns = [
    path("upload/", UploadFileView.as_view(), name="upload-file"),
    path("jobs/<int:job_id>/", job_status),
]