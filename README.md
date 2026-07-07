# Rhombus_AI_Processing_Platform

## Progress
- [X] Django backend created
- [X] Job model
- [X] Django REST Framework
- [X] Upload API endpoint
- [X] Celery
- [X] Redis
- [X] PySpark
- [ ] React Frontend
- [ ] Docker
- [ ] Deployment

Currently the website's backend when trigger on local server with prompts python3 -m celery -A config.celery worker -l info, redis server and python3 manage.py runserver in three seperate terminals. The npm run dev will cause a frontend to load but currently displays no frontend. The backend is modelled using django backend where the files of csv or xcel are uploaded into the file using localhost..../upload, the natural language prompt, replacement text and column title. This version finishes the replacement and then uploads the replacement to the file name media/processedjobs_{id}. it currently does not return the replacement back to backend. To see status and information about the server it can be accessed on /api/jobs/{id}/ where the processed information where its processed using spark and llms gemini are confirgured. Currently to be implemented into the server is the frontend to connect them and to upload the file into the main server.