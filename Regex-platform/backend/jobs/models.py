from django.db import models

class Job(models.Model):
    STATUS_CHOICES = [
        ("QUEUED", "Queued"),
        ("RUNNING", "Running"),
        ("SUCCESS" ,"Success"),
        ("FAILED", "Failed"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="QUEUED")
    progress = models.IntegerField(default=0)
    original_file = models.FileField(upload_to="uploads/")
    result_file = models.FileField(upload_to="results/", null=True, blank=True)
    natural_language_prompt = models.TextField()
    regex_pattern = models.TextField(blank=True)
    replacement_value = models.CharField(max_length=255)
    target_column = models.CharField(max_length=255)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
