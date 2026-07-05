from celery import shared_task
import time
from .models import Job

@shared_task
def process_file(job_id):
    job = Job.objects.get(id=job_id)

    job.status = "RUNNING"
    job.progress = 25
    job.save()

    time.sleep(3)

    job.progress = 75
    job.save()

    time.sleep(3)

    job.progress = 100
    job.status = "SUCCESS"
    job.save()
    # Ask LLM
    # Run Spark
    # Save Results
    # Update Progress
    return f"Finished job {job_id}"