#!/bin/bash
# Render will run this
uvicorn app.main:app --host 0.0.0.0 --port 10000
