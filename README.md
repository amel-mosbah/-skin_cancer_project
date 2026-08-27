# Skin Cancer API

![CI](https://github.com/amel-mosbah/-skin_cancer_project/actions/workflows/ci.yml/badge.svg)
# 🩺 Skin Cancer Detection — End-to-End AI System

An end-to-end Artificial Intelligence application for classifying skin lesions from dermoscopic images using Deep Learning and Transfer Learning.

The project covers the complete AI pipeline, from model development and evaluation to API integration, Dockerization, CI/CD and web deployment.

---

## 🎯 Project Overview

The objective of this project is to develop a Deep Learning-based system capable of classifying dermoscopic skin lesion images into seven different categories.

The application allows a user to upload an image through a web interface and receive a predicted lesion class along with a simple description.

> ⚠️ This project is an academic Proof of Concept (POC) and is not intended to replace professional medical diagnosis.

---

## 🧠 AI Model

The classification model is based on **InceptionV3** using **PyTorch**.

A **Transfer Learning** approach was used instead of training a CNN from scratch.

The pretrained InceptionV3 architecture was adapted to the HAM10000 classification problem by replacing its final classification layer with a layer containing 7 output classes.

### Classes

| Code | Class |
|------|-------|
| nv | Nevus |
| mel | Melanoma |
| bkl | Benign Keratosis |
| bcc | Basal Cell Carcinoma |
| akiec | Actinic Keratosis |
| df | Dermatofibroma |
| vasc | Vascular Lesion |

---

## 📊 Dataset

The project uses the **HAM10000 (Human Against Machine with 10000 training images)** dataset.

The dataset contains dermatoscopic images belonging to seven diagnostic categories.

The classes are naturally imbalanced, with a strong representation of the `nv` class.

In this Proof of Concept, the class imbalance was not treated using advanced techniques such as class weighting, oversampling or focal loss.

This limitation is considered as a possible future improvement.

---

## 🔄 End-to-End Architecture

```text
HAM10000 Dataset
       │
       ▼
Data Preparation & Preprocessing
       │
       ▼
Transfer Learning — InceptionV3
       │
       ▼
Model Training & Evaluation
       │
       ▼
Trained PyTorch Model
       │
       ▼
FastAPI REST API
       │
       ▼
Dockerized Backend
       │
       ▼
Render Deployment
       │
       ▼
React + Tailwind CSS Frontend
       │
       ▼
Netlify Deployment
       │
       ▼
User uploads an image
       │
       ▼
Prediction + Class Description
