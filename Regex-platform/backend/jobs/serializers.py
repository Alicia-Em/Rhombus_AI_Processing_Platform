from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = [
            "id",
            "status",
            "progress",
            "regex_pattern",
            "result_file",
            "error_message",
            "created_at",
        ]