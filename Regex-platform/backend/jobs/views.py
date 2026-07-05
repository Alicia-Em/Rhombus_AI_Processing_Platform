from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Job
from .serializers import JobSerializer
from .tasks import process_file

@api_view(["GET"])
def job_status(request, job_id):
    job = Job.objects.get(id=job_id)
    serializer = JobSerializer(job)
    return Response(serializer.data)

@api_view(["GET"])
def upload_file(request):
    job = Job.objects.create(
        status="QUEUED",
        progress=0,
        replacement_value="REDACTED"
    )
    process_file.delay(job.id)
    serializer = JobSerializer(job)
    return Response(serializer.data)
