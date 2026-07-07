from django.urls import path
from .views import UploadFileView, get_all_jobs, download_result, job_status

urlpatterns = [
    path("upload/", UploadFileView.as_view(), name="upload-file"),
    path("jobs/<int:job_id>/", job_status),
    path("jobs/", get_all_jobs),
    path("jobs/<int:job_id>/download/", download_result, name="download-result"),
]