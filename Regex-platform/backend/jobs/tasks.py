from celery import shared_task
import time
import re
from .models import Job
import anthropic

@shared_task
def process_file(job_id):
    job = Job.objects.get(id=job_id)
    try:
        job.status = "RUNNING"
        job.progress = 25
        job.save()
        # RUN LLM
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="claude-3-5-sonnet-latest",
            max_tokens=1024,
            messages=[
                {"role": "user",
                "content": (
                    "Convert this request into a single valid Python regex string."
                    f"Return only the regex pattern, no explanation, no markdown for {job.natural_language_prompt}"
                    ),
                }
            ],
        )
        regex = response.content[0].text.strip()
        re.compile(regex)
        job.progress = 50
        job.regex_pattern = regex
        job.save()
        job.progress = 100
        job.status = "SUCCESS"
        job.save()
        # Run Spark
        # Save Results
        # Update Progress
        return f"Finished job {job_id}"
    except Exception as e:
        job.status = "FAILED"
        job.error_message = str(e)
        job.save()
        raise