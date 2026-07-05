from celery import shared_task

@shared_task
def process_file(job_id):
    # Ask LLM
    # Run Spark
    # Save Results
    # Update Progress
    print(f"Processing job {job_id}")
    return f"Finished job {job_id}"