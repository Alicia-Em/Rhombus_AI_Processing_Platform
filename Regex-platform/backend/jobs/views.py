from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Job
from .serializers import JobSerializer
from .tasks import process_file

class UploadFileView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    parser_classes = [MultiPartParser, FormParser]
    def perform_create(self, serializer):
        job = serializer.save()
        process_file.delay(job.id)


@api_view(["GET"])
def job_status(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    serializer = JobSerializer(job)
    return Response(serializer.data)

@api_view(["GET"])
def get_all_jobs(request):
    jobs = Job.objects.all().order_by('-created_at')
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def download_result(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    if job.status == "SUCCESS" and job.result_file:
        return Response({
            'download_url': job.result_file.url
        })
    return Response({'error': 'Result file not avaliable'}, status=404)
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        job = serializer.save()
        process_file.delay(job.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
