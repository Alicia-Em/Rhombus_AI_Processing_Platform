from celery import shared_task
from pyspark.sql import SparkSession
import re
from .models import Job
import anthropic
from pyspark.sql.functions import col, regexp_replace
from .redis_client import r

@shared_task
def process_file(job_id):
    job = Job.objects.get(id=job_id)
    try:
        job.status = "RUNNING"
        job.progress = 25
        job.save()
        # RUN LLM
        language_prompt = r.get(job.natural_language_prompt)
        if language_prompt is None:
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
            r.set(job.natural_language_prompt, regex)
        else:
            regex = language_prompt
        re.compile(regex)
        job.progress = 50
        job.regex_pattern = regex
        job.save()
        spark = SparkSession.builder.appName("RegexProcessor").getOrCreate()
        df = spark.read.csv(job.original_file.path, header=True, inferSchema=True)
        df_cleaned = df.withColumn(
            job.target_column,
            regexp_replace(
                col(job.target_column),
                job.regex_pattern,
                job.replacement_text
            )
        )
        output_path = f"media/processed/jobs_{job.id}"
        df_cleaned.write.mode("overwrite").csv(output_path, header=True)
        job.progress = 100
        job.result_file = output_path
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