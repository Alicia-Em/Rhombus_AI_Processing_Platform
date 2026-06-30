from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer

def upload_file(request):
    job = Job.objects.create(
        status="QUEUED",
        progress=0,
        replacement_value="REDACTED"
    )
    serializer = JobSerializer(job)
    return Response(serializer.data)
